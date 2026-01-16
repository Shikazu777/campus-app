import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/ui/students")
      .then(res => res.json())
      .then(data => setStudents(data));
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Campus Trust Dashboard</h1>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Trust Score</th>
            <th>Tier</th>
            <th>Risk</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.email}</td>
              <td>{s.trust_score}</td>
              <td>{s.trust_tier}</td>
              <td style={{ color: s.risky ? "red" : "green" }}>
                {s.risky ? "HIGH" : "LOW"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
