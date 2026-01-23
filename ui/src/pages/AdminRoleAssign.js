import { useEffect, useState } from "react";

export default function AdminRoleAssign() {
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState(null);

  const loadUsers = () => {
    fetch("http://localhost:8000/admin/users")
      .then(res => res.json())
      .then(setUsers);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const assignRole = async (userId, role) => {
    setMsg(null);

    const res = await fetch(
      "http://localhost:8000/admin/assign-role",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          role
        })
      }
    );

    const data = await res.json();
    setMsg(data.message || data.error);
    loadUsers();
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>👑 Role Assignment</h2>

      {msg && <p>{msg}</p>}

      {users.map(u => (
        <div key={u.id} style={card}>
          <div>
            <strong>{u.email}</strong>
            <p>User type: {u.user_type}</p>
            <p>Roles: {u.roles?.join(", ") || "None"}</p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => assignRole(u.id, "CANTEEN_EDITOR")}
              disabled={u.roles?.includes("CANTEEN_EDITOR")}
            >
              Canteen Admin
            </button>

            <button
              onClick={() => assignRole(u.id, "EVENT_EDITOR")}
              disabled={u.roles?.includes("EVENT_EDITOR")}
            >
              Event Manager
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const card = {
  background: "white",
  padding: 16,
  borderRadius: 10,
  marginBottom: 12,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};
