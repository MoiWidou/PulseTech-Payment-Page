import './App.css';
import Landing from '../pages/Landing';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SuccessModal from "../components/modals/SuccessModal";
import FailedModal from "../components/modals/FailedModal";
import PendingModal from "../components/modals/PendingModal";
import Confirm from "../pages/Confirm";
import NotFound from "../pages/NotFound";

function App() {

  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<NotFound />} />
        <Route path="/:merchant_username" element={<Landing />} />
        <Route path="/:merchant_username/status/success" element={<SuccessModal />} />
        <Route path="/:merchant_username/status/failed" element={<FailedModal />} />
        <Route path="/:merchant_username/status/pending" element={<PendingModal />} />
        <Route path="/:merchant_username/confirm" element={<Confirm />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
