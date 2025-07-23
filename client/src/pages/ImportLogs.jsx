import { useEffect, useState } from "react";
import ImportLogTable from "../components/ImportLogTable";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { fetchImportLogs } from "../services/importLogService";

const ImportLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      setError("");
      try {
        const { logs, totalPages } = await fetchImportLogs(page);
        setLogs(logs);
        setTotalPages(totalPages);
      } catch (err) {
        console.log(err);
        setError("Failed to load logs");
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, [page]);

  return (
    <div className="container">
      <h1>Import Logs</h1>
      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && (
        <>
          <ImportLogTable logs={logs} />
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default ImportLogs;
