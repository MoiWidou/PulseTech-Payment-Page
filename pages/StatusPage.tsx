import { useSearchParams, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SuccessModal from "../components/modals/SuccessModal";
import FailedModal from "../components/modals/FailedModal";
import PendingModal from "../components/modals/PendingModal";

function StatusPage() {
  const { merchant_username } = useParams();
  const [searchParams] = useSearchParams();
  const reference_id = searchParams.get("reference_id");

  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const api_base_url = import.meta.env.VITE_API_BASE_URL

    if (!merchant_username || !reference_id) return;

    const fetchStatus = async () => {
      const res = await fetch(
        `${api_base_url}/payment-page/${merchant_username}/payment?transaction_id=${reference_id}`,
        { method: "POST" }
      );

      const data = await res.json();
      setStatus(data.status);
    };

    fetchStatus();
  }, [merchant_username, reference_id]);

  if (!status) return null;

  if (status === "SUCCESS") return <SuccessModal />;
  if (status === "FAILED") return <FailedModal />;
  if (status === "PENDING") return <PendingModal />;

  return null;
}

export default StatusPage;