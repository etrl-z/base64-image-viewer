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
    // Current map
    const imageRef = doc(db, "maps", "current");

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

    const historyQuery = query(
      historyRef,
      orderBy("timestamp", "desc"),
      limit(10)
    );

    const unsubscribeHistory = onSnapshot(historyQuery, (snapshot) => {
      const runs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setHistory(runs);

      // Top 5 winners
      const winnerCounts = {};

      runs.forEach((run) => {
        if (!run.winnerName) return;

        winnerCounts[run.winnerName] =
          (winnerCounts[run.winnerName] || 0) + 1;
      });

      const top = Object.entries(winnerCounts)
        .map(([winnerName, wins]) => ({
          winnerName,
          wins,
        }))
        .sort((a, b) => b.wins - a.wins)
        .slice(0, 5);

      setTopWinners(top);
    });

    return () => {
      unsubscribeImage();
      unsubscribeHistory();
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
            <div>#</div>
            <div>Winner</div>
            <div>Duration</div>
          </div>

          {history.map((run, index) => (
            <div className="grid row" key={run.id}>
              <div>{index + 1}</div>
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

        {/* Top 5 winners */}
        <div className="stats-section">
          <h2>Top 5 Winners</h2>

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
