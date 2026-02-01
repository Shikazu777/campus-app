import { useEffect, useState } from "react";
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

  const isAdmin = user.user_type === "owner";

  useEffect(() => {
    const url = isAdmin
      ? "http://localhost:8000/analytics/admin"
      : `http://localhost:8000/analytics/student/${user.id || 1}`;

    fetch(url)
      .then((res) => res.json())
      .then(setData);
  }, [isAdmin, user]);

  const [trust, setTrust] = useState(null);

  useEffect(() => {
    const trustUrl = isAdmin
      ? "http://localhost:8000/analytics/trust/admin"
      : `http://localhost:8000/analytics/trust/student/${user.id || 1}`;

    fetch(trustUrl)
      .then((res) => res.json())
      .then(setTrust);
  }, [isAdmin, user]);

  if (!data || !trust) return <p>Loading analytics...</p>;

  /* ---------------- STUDENT CHART DATA ---------------- */

  const pieData = {
    labels: ["Food", "Events"],
    datasets: [
      {
        data: [data.totals?.canteen || 0, data.totals?.event || 0],
        backgroundColor: ["#22c55e", "#3b82f6"],
      },
    ],
  };

  const lineData = {
    labels: (data.timeline || []).map(t => t.date),
    datasets: [
      {
        label: "Spending",
        data: (data.timeline || []).map(t => t.amount),
        borderColor: "#2563eb",
        backgroundColor: "#93c5fd",
        tension: 0.3,
      },
    ],
  };

  /* ---------------- ADMIN CHART DATA ---------------- */

  const barData = isAdmin
    ? {
        labels: data.students.map((s) => s.email),
        datasets: [
          {
            label: "Total Spent",
            labels: (data.students || []).map(s => s.email),
            data: (data.students || []).map(s => s.total_spent),
            backgroundColor: "#6366f1",
          },
        ],
      }
    : null;

  return (
    <div style={{ maxWidth: 900 }}>
      <h2>📊 Analytics</h2>

      {/* STUDENT VIEW */}
      {!isAdmin && (
        <>
          <h3>Spending Breakdown</h3>
          <div style={card}>
            <Pie data={pieData} />
          </div>

          <h3>Spending Over Time</h3>
          <div style={card}>
            <Line data={lineData} />
          </div>

          <h3>Most Ordered Food</h3>
          <p>🍽 {data.top_food || "No orders yet"}</p>

          <h3>Trust Score</h3>

          <div style={card}>
            <p>
              <b>Score:</b> {trust.trust_score}
            </p>
            <p>
              <b>Tier:</b> {trust.trust_tier}
            </p>

            <p>
              🍽 Orders Collected: {trust.orders.collected} /{" "}
              {trust.orders.total}
            </p>
            <p>🎟 Events Attended: {trust.events.attended}</p>
            <p>❌ No-shows: {trust.events.no_shows}</p>

            <h4>How to improve</h4>
            <ul>
              {trust.events.no_shows > 0 && <li>Avoid event no-shows</li>}
              {trust.orders.collected < trust.orders.total && (
                <li>Collect placed food orders on time</li>
              )}
              {trust.events.attended === 0 && <li>Attend registered events</li>}
              {trust.trust_score >= 80 && (
                <li>Great consistency — keep it up 👍</li>
              )}
            </ul>
          </div>
        </>
      )}

      {/* ADMIN VIEW */}
      {isAdmin && (
        <>
          <h3>Student Spending (Campus)</h3>
          <div style={card}>
            <Bar data={barData} />
          </div>

          <h3>Most Ordered Food (Campus)</h3>
          <p>🍔 {data.most_ordered_food}</p>

          <h3>Trust Scores (Campus)</h3>

          <table border="1" cellPadding="6">
            <thead>
              <tr>
                <th>Student</th>
                <th>Score</th>
                <th>Tier</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {(trust || []).map(s => (
                <tr key={s.student_id}>
                  <td>{s.email}</td>
                  <td>{s.trust_score}</td>
                  <td>{s.trust_tier}</td>
                  <td>{s.trust_score < 40 ? "⚠ High" : "Normal"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

const card = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  marginBottom: 30,
};
