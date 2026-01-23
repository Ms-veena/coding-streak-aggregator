import { useState } from "react";

function App() {
  const [cfHandle, setCfHandle] = useState("");
  const [lcHandle, setLcHandle] = useState("");
  const [data, setData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const refreshProfile = async () => {
    if (!cfHandle || !lcHandle) {
      setError("Please enter both Codeforces and LeetCode handles");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setData(null);

      // 1. Refresh combined profile
      await fetch(
        `https://coding-streak-aggregator.onrender.com/refresh/combined/${cfHandle}/${lcHandle}`
      );

      // 2. Fetch profile
      const profileRes = await fetch(
        `https://coding-streak-aggregator.onrender.com/profile/${cfHandle}`
      );
      const profileJson = await profileRes.json();

      if (!profileRes.ok) {
        throw new Error(profileJson.error || "Failed to load profile");
      }

      setData(profileJson);

      // 3. Fetch leaderboard
      const lbRes = await fetch(`https://coding-streak-aggregator.onrender.com/leaderboard`);
      const lbJson = await lbRes.json();
      setLeaderboard(lbJson);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Coding Streak Aggregator</h1>

      {/* INPUTS */}
      <div style={styles.inputBox}>
        <input
          placeholder="Codeforces handle"
          value={cfHandle}
          onChange={(e) => setCfHandle(e.target.value)}
          style={styles.input}
        />
        <input
          placeholder="LeetCode handle"
          value={lcHandle}
          onChange={(e) => setLcHandle(e.target.value)}
          style={styles.input}
        />
        <button onClick={refreshProfile} style={styles.button}>
          {loading ? "Refreshing..." : "Refresh & Generate"}
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {/* PROFILE CARDS */}
      {data && (
        <div style={styles.cards}>
          {data.profiles.map((p, index) => (
            <div
              key={index}
              style={{
                ...styles.card,
                backgroundColor:
                  p.platform === "combined" ? "#e6f4ea" : "#ffffff",
                border:
                  p.platform === "combined"
                    ? "2px solid #34a853"
                    : "none",
              }}
            >
              <h3
                style={{
                  color:
                    p.platform === "combined" ? "#1e7f43" : "#000",
                }}
              >
                {p.platform.toUpperCase()}
              </h3>

              <p><b>Handle:</b> {p.handle}</p>
              <p><b>Streak:</b> {p.streak}</p>
              <p><b>Score:</b> {p.score}</p>

              {p.leetcode && (
                <p><b>LeetCode Solved:</b> {p.leetcode.totalSolved}</p>
              )}

              <p><b>Rank:</b> #{p.rank}</p>
            </div>
          ))}
        </div>
      )}

      {/* LEADERBOARD */}
      {leaderboard.length > 0 && (
        <div style={styles.leaderboard}>
          <h2>Global Leaderboard</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Platform</th>
                <th>Handle</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((row, idx) => (
                <tr
                  key={idx}
                  style={{
                    backgroundColor:
                      row.platform === "combined" ? "#e6f4ea" : "#fff",
                  }}
                >
                  <td>#{idx + 1}</td>
                  <td>{row.platform}</td>
                  <td>{row.handle}</td>
                  <td>{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px",
    backgroundColor: "#f4f6f8",
    fontFamily: "Arial",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
  },
  inputBox: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    width: "200px",
  },
  button: {
    padding: "10px 16px",
    fontSize: "16px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  cards: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginTop: "30px",
  },
  card: {
    padding: "20px",
    width: "260px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  leaderboard: {
    marginTop: "50px",
    textAlign: "center",
  },
  table: {
    width: "80%",
    margin: "20px auto",
    borderCollapse: "collapse",
  },
};

export default App;
