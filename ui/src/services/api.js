const API_BASE = "http://127.0.0.1:8000";

export async function getStudents() {
  const res = await fetch(`${API_BASE}/ui/students`);
  return res.json();
}
