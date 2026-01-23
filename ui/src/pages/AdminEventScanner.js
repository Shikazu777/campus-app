import { useState } from "react";

export default function AdminEventScanner() {
  const [qr, setQr] = useState("");
  const [result, setResult] = useState(null);

  const scanQr = async () => {
    setResult(null);

    try {
      const res = await fetch(
        `http://localhost:8000/event/scan?qr_token=${qr}`,
        { method: "POST" }
      );

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Server unreachable" });
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>🎟 Event Entry Scanner</h2>

      <input
        value={qr}
        onChange={e => setQr(e.target.value)}
        placeholder="Paste QR token"
        style={input}
      />

      <button onClick={scanQr} style={btn}>
        Scan
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          {result.error ? (
            <p style={{ color: "red" }}>{result.error}</p>
          ) : (
            <p style={{ color: "green" }}>
              ✅ Entry Allowed (Student #{result.student_id})
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const input = {
  padding: 10,
  width: "100%",
  maxWidth: 300,
  marginBottom: 10
};

const btn = {
  padding: "10px 20px",
  cursor: "pointer"
};
