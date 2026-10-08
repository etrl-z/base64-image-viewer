import { useState } from "react";

function StatsPage({ allWinners, longestRuns, fastestRuns }) {
  const [tab, setTab] = useState("winners");

  return (
    <div>
      <div className="tabs">
        <button
          className={tab === "winners" ? "tab-btn active" : "tab-btn"}
          onClick={() => setTab("winners")}
        >
          All time winners
        </button>
        <button
          className={tab === "runs" ? "tab-btn active" : "tab-btn"}
          onClick={() => setTab("runs")}
        >
          100 Longest Runs
        </button>
        <button
          className={tab === "fastest" ? "tab-btn active" : "tab-btn"}
          onClick={() => setTab("fastest")}
        >
          100 Fastest Runs
        </button>
      </div>

      <div className="stats">
        {tab === "winners" && (
          <div className="stats-section full-width">
            <h2>All time winners</h2>
            <div className="grid header winner-grid">
              <div>#</div>
              <div>Winner</div>
              <div>Wins</div>
            </div>
            {allWinners.map((w, i) => (
              <div className="grid row winner-grid" key={w.winnerName}>
                <div>{i + 1}</div>
                <div>{w.winnerName}</div>
                <div>{w.wins}</div>
              </div>
            ))}
            {allWinners.length === 0 && (
              <div className="empty">No winners available</div>
            )}
          </div>
        )}

        {tab === "runs" && (
          <div className="stats-section full-width">
            <h2>100 Longest Runs</h2>
            <div className="grid header">
              <div>Date</div>
              <div>Winner</div>
              <div>Turns</div>
            </div>
            {longestRuns.map((run) => (
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
            {longestRuns.length === 0 && (
              <div className="empty">No runs available</div>
            )}
          </div>
        )}

        {tab === "fastest" && (
          <div className="stats-section full-width">
            <h2>100 Fastest Runs</h2>
            <div className="grid header">
              <div>Date</div>
              <div>Winner</div>
              <div>Turns</div>
            </div>
            {fastestRuns.map((run) => (
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
            {fastestRuns.length === 0 && (
              <div className="empty">No runs available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StatsPage;
