import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [value, setValue] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const submit = () => {
    const v = value.trim().toUpperCase();
    setError(null);

    if (v === "ADMIN") {
      login({
        user_type: "owner",
        roles: ["EVENT_EDITOR", "CANTEEN_EDITOR"]
      });
    } else if (v === "STUDENT") {
      login({
        user_type: "student",
        roles: []
      });
    } else if (v === "CANTEENEDITOR") {
      login({
        user_type: "student",
        roles: ["CANTEEN_EDITOR"]
      });
    } else if (v === "EVENTEDITOR") {
      login({
        user_type: "student",
        roles: ["EVENT_EDITOR"]
      });
    } else {
      setError("Enter ADMIN / STUDENT / CANTEENEDITOR / EVENTEDITOR");
      return;
    }
  };

  return (
    <div style={wrap}>
      <h2>Campus Login (Demo)</h2>

      <input
        placeholder="ADMIN / STUDENT / CANTEENEDITOR / EVENTEDITOR"
        value={value}
        onChange={e => setValue(e.target.value)}
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
  maxWidth: 420,
  margin: "100px auto",
  textAlign: "center",
  background: "white",
  borderRadius: 12
};

const input = {
  width: "100%",
  padding: 12,
  marginBottom: 12
};

const btn = {
  width: "100%",
  padding: 12,
  cursor: "pointer"
};
