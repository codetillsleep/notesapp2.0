export async function fetchSubjects() {
  const res = await fetch("/api/subjects");
  if (!res.ok) throw new Error("Failed to fetch subjects");
  return res.json();
}

export async function addSubject(data: any) {
  const res = await fetch("/api/subjects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add subject");
  return res.json();
}
