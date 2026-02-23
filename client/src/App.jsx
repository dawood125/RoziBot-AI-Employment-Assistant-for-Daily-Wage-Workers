import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import WorkerChat from "./pages/WorkerChat";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chat" element={<WorkerChat />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;