import "./ImportLogTable.css";

const ImportLogTable = ({ logs }) => {
  if (!logs.length) return <p className="empty-state">No logs found.</p>;

  return (
    <table className="log-table">
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Source</th>
          <th>Total</th>
          <th>New</th>
          <th>Updated</th>
          <th>Failed</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr key={log._id}>
            <td>{new Date(log.timestamp).toLocaleString()}</td>
            <td>{log.fileName}</td>
            <td>{log.totalFetched}</td>
            <td>{log.newJobs}</td>
            <td>{log.updatedJobs}</td>
            <td>{log.failedJobs.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ImportLogTable;
