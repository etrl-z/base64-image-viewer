import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

import { db } from "./firebaseConfiguration";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [info, setInfo] = useState(null);
  const [history, setHistory] = useState([]);
  const [topWinners, setTopWinners] = useState([]);

  useEffect(() => {
    
    const mapDocument = import.meta.env.VITE_MAP_DOCUMENT || "current";

    const imageRef = doc(db, "maps", mapDocument);

    const unsubscribeImage = onSnapshot(imageRef, (snapshot) => {
      if (!snapshot.exists()) {
        console.log("Document not found");
        return;
      }

      const data = snapshot.data();

      setImage(
        `data:image/${data.format};base64,${data.imageBase64}`
      );

      setInfo(data);
    });

    // Last 10 runs
    const historyRef = collection(db, "history");

    const lastRunsQuery = query(
      historyRef,
      orderBy("timestamp", "desc"),
      limit(10)
    );

    const unsubscribeLastRuns = onSnapshot(
      lastRunsQuery,
      (snapshot) => {
        const runs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setHistory(runs);
      }
    );

    // Full history - used for Top 10
    const allHistoryQuery = query(
      historyRef,
      orderBy("timestamp", "desc")
    );

    const unsubscribeAllHistory = onSnapshot(
      allHistoryQuery,
      (snapshot) => {
        const winnerCounts = {};

        snapshot.docs.forEach((doc) => {
          const data = doc.data();

          if (!data.winnerName) return;

          winnerCounts[data.winnerName] =
            (winnerCounts[data.winnerName] || 0) + 1;
        });

        const top = Object.entries(winnerCounts)
          .map(([winnerName, wins]) => ({
            winnerName,
            wins,
          }))
          .sort((a, b) => b.wins - a.wins)
          .slice(0, 10);

        setTopWinners(top);
      }
    );

    // Cleanup
    return () => {
      unsubscribeImage();
      unsubscribeLastRuns();
      unsubscribeAllHistory();
    };
  }, []);

  return (
    <div className="app">
      {image ? (
        <img
          src={image}
          alt="Map"
          className="map"
        />
      ) : (
        <p>Loading image...</p>
      )}

      {info && (
        <div className="info">
          <div>{info.fileName}</div>

          <div>
            Last Update:{" "}
            {info.timestamp?.toDate?.().toLocaleString()}
          </div>
        </div>
      )}

      <div className="stats">
        {/* Last 10 runs */}
        <div className="stats-section">
          <h2>Last 10 Runs</h2>

          <div className="grid header">
            <div>Date</div>
            <div>Winner</div>
            <div>Turns</div>
          </div>

          {history.map((run) => (
            <div className="grid row" key={run.id}>
              <div>
                {run.timestamp?.toDate?.().toLocaleString("it-IT", {
                  day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit"
                })}
              </div>
              <div>{run.winnerName}</div>
              <div>{run.duration}</div>
            </div>
          ))}

          {history.length === 0 && (
            <div className="empty">
              No runs available
            </div>
          )}
        </div>

        {/* Top 10 winners */}
        <div className="stats-section">
          <h2>Top 10 Winners</h2>

          <div className="grid header winner-grid">
            <div>#</div>
            <div>Winner</div>
            <div>Wins</div>
          </div>

          {topWinners.map((winner, index) => (
            <div
              className="grid row winner-grid"
              key={winner.winnerName}
            >
              <div>{index + 1}</div>
              <div>{winner.winnerName}</div>
              <div>{winner.wins}</div>
            </div>
          ))}

          {topWinners.length === 0 && (
            <div className="empty">
              No winners available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
