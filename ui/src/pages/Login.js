import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async () => {
    setError(null);

    const res = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (data.error) {
      setError(data.error);
    } else {
      login(data);
      navigate("/events");
    }
  };

  return (
    <div style={wrap}>
      <h2>Campus Login</h2>

      <input
        placeholder="College email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={input}
      />

      <button onClick={submit} style={btn}>
        Login
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

const wrap = {
  padding: 40,
  maxWidth: 320,
  margin: "auto"
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 12
};

const btn = {
  padding: "10px 20px",
  width: "100%"
};
