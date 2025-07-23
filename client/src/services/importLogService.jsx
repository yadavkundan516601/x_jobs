const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const fetchImportLogs = async (page = 1, limit = 10) => {
  const res = await fetch(
    `${API_BASE}/import-logs?page=${page}&limit=${limit}`
  );
  if (!res.ok) throw new Error("Failed to fetch import logs");
  const data = await res.json();
  return {
    logs: data.logs || [],
    totalPages: data.totalPages || 1,
  };
};
