import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
);

export default function Analytics() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAdmin = user.user_type === "owner";
  const userId = user.id || 1;
  const apiBase = "http://localhost:8000";


useEffect(() => {
  let isActive = true;

  const url = isAdmin
    ? `${apiBase}/analytics/admin`
    : `${apiBase}/analytics/student/${userId}`;

  fetch(url)
    .then((res) => res.json())
    .then((payload) => {
      if (isActive) setData(payload);
    })
    .finally(() => {
      if (isActive) setIsLoading(false);
    });

  return () => {
    isActive = false;
  };
}, [apiBase, isAdmin, userId]);


  const [trust, setTrust] = useState(null);

  useEffect(() => {
        let isActive = true;
       const trustUrl = isAdmin
        ? `${apiBase}/analytics/trust/admin`
        : `${apiBase}/analytics/trust/student/${userId}`;
    fetch(trustUrl)
      .then((res) => res.json())
      .then((payload) => {
        if (isActive) setTrust(payload);
      });
    return () => {
      isActive = false;
    };
  }, [apiBase, isAdmin, userId]);


  /* ---------------- STUDENT CHART DATA ---------------- */

const pieData = useMemo(
    () => ({
      labels: ["Food", "Events"],
      datasets: [
        {
          data: [data.totals?.canteen || 0, data.totals?.event || 0],
          backgroundColor: ["#22c55e", "#3b82f6"],
        },
      ],
    }),
    [data],
  );

  const lineData = useMemo(
    () => ({
      labels: (data.timeline || []).map((item) => item.date),
      datasets: [
        {
          label: "Spending",
          data: (data.timeline || []).map((item) => item.amount),
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.2)",
          tension: 0.3,
          pointRadius: 2,
        },
      ],
    }),
    [data],
  );

  /* ---------------- ADMIN CHART DATA ---------------- */

  const barData = useMemo(() => {
    if (!isAdmin) return null;
    return {
      labels: (data.students || []).map((student) => student.email),
      datasets: [
        {
          label: "Total Spent",
          data: (data.students || []).map((student) => student.total_spent),
          backgroundColor: "#6366f1",
          borderRadius: 8,
        },
      ],
    };
  }, [data, isAdmin]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 40,
            minRotation: 0,
          },
        },
      },
    }),
    [],
  );

  if (isLoading || !data || !trust) {
  return <p style={styles.loading}>Loading analytics...</p>;
}

  const exportUrl = isAdmin
    ? `${apiBase}/analytics/export/admin`
    : `${apiBase}/analytics/export/student/${userId}`;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.kicker}>Campus insights</p>
          <h2 style={styles.title}>📊 Analytics Dashboard</h2>
          <p style={styles.subtitle}>
            Track spending, engagement, and trust indicators in one place.
          </p>
        </div>
        <a href={exportUrl} style={styles.exportButton}>
          Export CSV
        </a>
      </div>

      {/* STUDENT VIEW */}
      {!isAdmin && (
        <div style={styles.grid}>
          <section style={{ ...styles.card, ...styles.chartCard }}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Spending Breakdown</h3>
              <span style={styles.cardMeta}>Food vs Events</span>
            </div>
            <div style={styles.chartArea}>
              <Pie data={pieData} options={chartOptions} />
            </div>
          </section>
          <section style={{ ...styles.card, ...styles.chartCard }}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Spending Over Time</h3>
              <span style={styles.cardMeta}>Daily totals</span>
            </div>
            <div style={styles.chartArea}>
              <Line data={lineData} options={chartOptions} />
            </div>
          </section>

          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Most Ordered Food</h3>
            </div>
            <p style={styles.highlightText}>
              🍽 {data.top_food || "No orders yet"}
            </p>
          </section>

          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Trust Score</h3>
            </div>
            <div style={styles.statRow}>
              <div>
                <p style={styles.statLabel}>Score</p>
                <p style={styles.statValue}>{trust.trust_score}</p>
              </div>
              <div>
                <p style={styles.statLabel}>Tier</p>
                <p style={styles.statValue}>{trust.trust_tier}</p>
              </div>
            </div>
            <div style={styles.metrics}>
              <p>
                🍽 Orders Collected: {trust.orders.collected} /{" "}
                {trust.orders.total}
              </p>
              <p>🎟 Events Attended: {trust.events.attended}</p>
              <p>❌ No-shows: {trust.events.no_shows}</p>
            </div>

            <h4 style={styles.sectionTitle}>How to improve</h4>
            <ul style={styles.list}>
              {trust.events.no_shows > 0 && <li>Avoid event no-shows</li>}
              {trust.orders.collected < trust.orders.total && (
                <li>Collect placed food orders on time</li>
              )}
              {trust.events.attended === 0 && <li>Attend registered events</li>}
              {trust.trust_score >= 80 && (
                <li>Great consistency — keep it up 👍</li>
              )}
            </ul>
          </section>
        </div>
      )}

      {/* ADMIN VIEW */}
      {isAdmin && (
        <div style={styles.grid}>
          <section style={{ ...styles.card, ...styles.chartCard }}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Student Spending (Campus)</h3>
              <span style={styles.cardMeta}>Total per student</span>
            </div>
            <div style={styles.chartArea}>
              <Bar data={barData} options={chartOptions} />
            </div>
          </section>

          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Most Ordered Food (Campus)</h3>
            </div>
            <p style={styles.highlightText}>
              🍔 {data.most_ordered_food || "No campus orders yet"}
            </p>
          </section>

          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Trust Scores (Campus)</h3>
            </div>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Score</th>
                    <th>Tier</th>
                    <th>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {(trust || []).map((student) => (
                    <tr key={student.student_id}>
                      <td>{student.email}</td>
                      <td>{student.trust_score}</td>
                      <td>{student.trust_tier}</td>
                      <td>
                        {student.trust_score < 40 ? "⚠ High" : "Normal"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 1100,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
    background: "white",
    padding: "20px 24px",
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
  },
  kicker: {
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: "0.18em",
    color: "#64748b",
    marginBottom: 4,
  },
  title: {
    margin: 0,
    fontSize: 28,
    color: "#0f172a",
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 0,
    color: "#475569",
  },
  exportButton: {
    background: "#2563eb",
    color: "white",
    textDecoration: "none",
    padding: "10px 18px",
    borderRadius: 10,
    fontWeight: 600,
    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.25)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 20,
  },
  card: {
    background: "white",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
  },
  chartCard: {
    minHeight: 320,
  },
  cardHeader: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  cardTitle: {
    margin: 0,
    fontSize: 18,
    color: "#0f172a",
  },
  cardMeta: {
    fontSize: 12,
    color: "#94a3b8",
  },
  chartArea: {
    minHeight: 240,
  },
  highlightText: {
    fontSize: 20,
    fontWeight: 600,
    color: "#1f2937",
  },
  statRow: {
    display: "flex",
    gap: 24,
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "#64748b",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
  },
  metrics: {
    display: "grid",
    gap: 6,
    color: "#475569",
    marginBottom: 12,
  },
  sectionTitle: {
    margin: "12px 0 8px",
    fontSize: 16,
    color: "#0f172a",
  },
  list: {
    margin: 0,
    paddingLeft: 18,
    color: "#475569",
    display: "grid",
    gap: 6,
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
  },
  loading: {
    padding: 20,
    fontSize: 16,
    color: "#475569",
  },
};
