import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ImportLogs from "./pages/ImportLogs";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<ImportLogs />} />
    </Routes>
  </Router>
);

export default App;
