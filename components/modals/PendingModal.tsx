import React from 'react';
import { 
//   Facebook, 
//   Instagram, 
//   Link2, 
  MoreHorizontal 
} from 'lucide-react';
import { useNavigate, useParams } from "react-router-dom";
// import SuccessModal from './SuccessModal';
// import FailedModal from './FailedModal';

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

type ModalProps = {
  paymentSummary: redirectResponse | null;
  merchantName: string;
};

const PendingModal: React.FC <ModalProps> = ({paymentSummary, merchantName }) => {
    // const api_base_url             = import.meta.env.VITE_API_BASE_URL
    const navigate                 = useNavigate();
    // const [searchParams]           = useSearchParams();
    // const reference_id             = searchParams.get("reference_id");
    const { merchant_username }    = useParams();
    // const [ _loading, setLoading ] = useState(false);
    // const [ _error, setError ]     = useState<string | null>(null);
    // const [ paymentSummary, setPaymentSummary] = useState <redirectResponse | null > (null);
    // const [ merchantName, setMerchantName ]    = useState ("");

    const formattedDate = paymentSummary && paymentSummary.created_at
        ? new Date(paymentSummary.created_at).toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            })
        : "—";

    // useEffect(() => {
    //         if (!merchant_username || !reference_id) return;

    //         const fetchData = async () => {
    //             try {
    //             setLoading(true);
    //             setError(null);

    //             const [paymentRes, merchantRes, methodRes] = await Promise.all([
    //                 fetch(
    //                 `${api_base_url}/payment-page/${merchant_username}/payment?transaction_id=${encodeURIComponent(reference_id)}`,
    //                 {
    //                     method: "POST",
    //                     headers: { "Content-Type": "application/json" },
    //                 }
    //                 ),
    //                 fetch(`${api_base_url}/payment-page/${merchant_username}`, {
    //                 method: "GET",
    //                 headers: { "Content-Type": "application/json" },
    //                 }),
    //                 fetch(
    //                     `${api_base_url}/payment-page/payment/methods?username=${merchant_username}`,
    //                     { 
    //                         method: "GET",
    //                         headers: { 
    //                             "Content-Type": "application/json",
    //                             "username"    : merchant_username
    //                         } 
                            
    //                 }
    //                 ),
    //             ]);

    //             if (!paymentRes.ok) throw new Error("Failed to verify payment");
    //             if (!merchantRes.ok) throw new Error("Failed to fetch merchant");
    //             if (!methodRes.ok) throw new Error("Failed to fetch payment method");

    //             const paymentData  = await paymentRes.json();
    //             const merchantData = await merchantRes.json();

    //             // Payment Status Redirections
    //             if (paymentData.status === "SUCCESS") return <SuccessModal />;
    //             if (paymentData.status === "FAILED") return <FailedModal />;
    //             if (paymentData.status === "PENDING") return <PendingModal />;      


    //             // Then set it in state
    //             setPaymentSummary(paymentData);
    //             setMerchantName(merchantData.merchant_name);

    //             } catch (err) {
    //             if (err instanceof Error) {
    //                 setError(err.message);
    //             } else {
    //                 setError("Something went wrong");
    //             }
    //             } finally {
    //             setLoading(false);
    //             }
    //         };

    //         fetchData();
    // }, [merchant_username, reference_id]);
    
    const totalAmount = (Number(paymentSummary?.amount)) + (Number(paymentSummary?.fees?.processing_fee)) + (Number(paymentSummary?.fees?.system_fee))

    // Fallback if no state is passed
    if (!paymentSummary) return <p className="text-center mt-10">No payment details available.</p>;


    return (
        /* UI Style Update: Background gradient from Purple to Light Green */
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-br from-[#FFFFFF] to-[#E6F4F1] p-2 font-sans">
        
            {/* Header Section */}
            <div className="flex flex-col items-center mb-4">
                <div className="w-20 h-20 bg-gray-300 rounded-full mb-2 shadow-inner" />
                {/* UI Style Update: Text color from Purple to Dark Green */}
                <h2 className="text-[#064e3b] text-lg font-bold">{merchantName}</h2>
                <div className="flex gap-2 mt-1 text-[#064e3b]">
                    {/* <Facebook size={16} className="cursor-pointer hover:opacity-70 transition-opacity" />
                    <Instagram size={16} className="cursor-pointer hover:opacity-70 transition-opacity" />
                    <Link2 size={16} className="cursor-pointer hover:opacity-70 transition-opacity" /> */}
                </div>
            </div>

            {/* Main Pending Card */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
                <div className="p-8 md:p-10 flex flex-col items-center text-center">
                
                    {/* Pending Icon (Keep Yellow for 'Warning/Pending' but adjust shadow if needed) */}
                    <div className="mb-6 flex items-center justify-center w-14 h-14 bg-[#D4AF37] rounded-full shadow-sm animate-pulse">
                        <MoreHorizontal size={32} color="white" strokeWidth={3} />
                    </div>

                    <h1 className="text-black text-2xl font-bold mb-1">Pending...</h1>
                    
                    {/* UI Style Update: Text color from Purple to Dark Green */}
                    <div className="text-[#064e3b] opacity-90 text-xs md:text-sm leading-snug mb-10 max-w-lg">
                        <p>Thank you for your payment request.</p>
                        <p>Your transaction is currently pending and is being processed.</p>
                    </div>

                    {/* Central Amount Display */}
                    <div className="mb-10">
                        <p className="text-xs md:text-sm text-[#064e3b]">
                            You have initiated a payment to
                        </p>
                        {/* UI Style Update: Changed Blue link to Emerald Green link */}
                        <p className="text-[#10b981] font-medium text-xs md:text-sm cursor-pointer">
                            {merchantName}
                        </p>
                        <h2 className="text-4xl font-bold text-black my-2">
                            ₱ {Number(totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h2>
                    </div>

                    {/* Date Display */}
                    <div className="mb-8">
                        <p className="text-[#6F7282] text-sm font-medium">{formattedDate}</p>
                    </div>

                    {/* Action Button */}
                    <div className="w-full flex justify-center">
                        <button 
                            /* UI Style Update: Gradient from Purple/Navy to Dark Green/Emerald */
                            className="w-full max-w-60 bg-[#202122] text-[#75EEA5] cursor-pointer hover:from-[#1B2A27] hover:shadow-lg hover:-translate-y-0.5 active:scale-95 font-semibold py-2.5 px-4 rounded-lg transition-all shadow-md text-xs"
                            onClick={() => navigate(`/${merchant_username}`)}
                        >
                            Make Another Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PendingModal;