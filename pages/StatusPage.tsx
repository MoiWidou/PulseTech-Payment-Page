import { useSearchParams, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SuccessModal from "../components/modals/SuccessModal";
import FailedModal from "../components/modals/FailedModal";
// import PendingModal from "../components/modals/PendingModal";
import Expired from "../components/modals/ExpiredModal";

type redirectResponse = {
    transaction_id: string,
    currency: string,
    created_at: string,
    status: string,
    updated_at: string,
    reference_id: string,
    type: string,
    error: string | null,
    webhook_url: string | null,
    amount: number,
    fees: {
        system_fee: string,
        processing_fee: string,
    },
    paid_at: string | null,
    payment_method: {
        method_code: string | null,
        provider_code: string | null
    }
}

type PaymentMethodItem = {
    provider_code: string;
    name: string;
    short_name: string;
    main_logo_url: string;
    status: string;
    country_code: string;
    fee_value: string | null;
    fee_type: string | null;
    method_code: string;
    category: string;
}

type PaymentMethodsResponse = Record<string, PaymentMethodItem[]>;

function StatusPage() {
    const api_base_url = import.meta.env.VITE_API_BASE_URL;
    const { merchant_username } = useParams();
    const [searchParams] = useSearchParams();
    const reference_id = searchParams.get("reference_id");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentSummary, setPaymentSummary] = useState <redirectResponse | null> (null);
    const [merchantName, setMerchantName] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [status, setStatus] = useState<string | null>(null); // <-- track payment status

    const Spinner = () => (
        <span className="inline-block w-16 h-16 border-4 border-gray-300 border-t-[#312B5B] rounded-full animate-spin" />
    );

    useEffect(() => {
        if (!merchant_username || !reference_id) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [paymentRes, merchantRes, methodRes] = await Promise.all([
                    fetch(`${api_base_url}/payment-page/${merchant_username}/payment?transaction_id=${encodeURIComponent(reference_id)}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                    }),
                    fetch(`${api_base_url}/payment-page/${merchant_username}`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }),
                    fetch(`${api_base_url}/payment-page/payment/methods?username=${merchant_username}`, { 
                        method: "GET",
                        headers: { 
                            "Content-Type": "application/json",
                            "username": merchant_username
                        } 
                    }),
                ]);

                if (!paymentRes.ok) throw new Error("Failed to verify payment");
                if (!merchantRes.ok) throw new Error("Failed to fetch merchant");
                if (!methodRes.ok) throw new Error("Failed to fetch payment method");

                const paymentData = await paymentRes.json();
                const merchantData = await merchantRes.json();
                const methodData = await methodRes.json();

                // Save status in state
                setStatus(paymentData.status);

                const paymentMethodData = paymentData.payment_method;
                let matchedName = "";

                // Loop through all categories in methodData
                for (const categoryKey in methodData) {
                    const providersArray = methodData[categoryKey];
                    const match = providersArray.find(
                        (item: PaymentMethodsResponse) =>
                            item.method_code === paymentMethodData.method_code &&
                            item.provider_code === paymentMethodData.provider_code
                    );
                    if (match) {
                        matchedName = match.name;
                        break;
                    }
                }

                // Set the rest of the state
                setPaymentSummary(paymentData);
                setMerchantName(merchantData.merchant_name);
                setPaymentMethod(matchedName);

            } catch (err) {
                if (err instanceof Error) setError(err.message);
                else setError("Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        const recheckStatusInterval = setInterval(fetchData, 30_000);

         return () => clearInterval(recheckStatusInterval);
    }, [merchant_username, reference_id]);

    // --- Render the correct modal based on status ---
    if (loading) {
        return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFFFFF] to-[#D0BBE6]">
                <Spinner />
            </div>
        );
    }
    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#FFFFFF] to-[#D0BBE6] text-center px-4">
                <p className="text-red-600 font-semibold mb-2">Something went wrong</p>
                <p className="text-[#312B5B] text-sm">{error}</p>
            </div>
        );
    };
    if (!status) return null; // still loading status
    // moises
    if (status === "SUCCESS") return <SuccessModal paymentSummary={paymentSummary} merchantName={merchantName} paymentMethod={paymentMethod} />;
    if (status === "FAILED") return <FailedModal paymentSummary={paymentSummary} merchantName={merchantName}/>;
    // if (status === "PENDING") return <PendingModal paymentSummary={paymentSummary} merchantName={merchantName}/>;
    // if (status === "PENDING") return <SuccessModal paymentSummary={paymentSummary} merchantName={merchantName} paymentMethod={paymentMethod} />;
    if (status === "PENDING") return <Expired />;
    // if (status === "CLOSED") return <Expired/>;

    return null;
}

export default StatusPage;