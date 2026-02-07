import './App.css';
import Landing from '../pages/Landing';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SuccessModal from "../components/SuccessModal";
import FailedModal from "../components/FailedModal";
import PendingModal from "../components/PendingModal";

function App() {

  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/status/success" element={<SuccessModal />} />
        <Route path="/status/failed" element={<FailedModal />} />
        <Route path="/status/pending" element={<PendingModal />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
