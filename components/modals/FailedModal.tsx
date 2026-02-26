import React from 'react';
import { 
//   Facebook, 
//   Instagram, 
//   Link2, 
  XCircle 
} from 'lucide-react';
import { useNavigate, useParams } from "react-router-dom";

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

const FailedModal: React.FC <ModalProps> = ({paymentSummary, merchantName}) => {
    // const api_base_url = import.meta.env.VITE_API_BASE_URL
    const navigate = useNavigate();
    // const location = useLocation();
    // const { paymentSummary } = location.state || {};
    // const [ _loading, setLoading ] = useState(false);
    // const [ _error, setError ]     = useState<string | null>(null);
    // const [searchParams]= useSearchParams();
    // const reference_id  = searchParams.get("reference_id");
    // const [ paymentSummary, setPaymentSummary] = useState <redirectResponse | null > (null);
    // const [ merchantName, setMerchantName ]    = useState ("");
    
    const { merchant_username } = useParams();
    
    const totalAmount = (Number(paymentSummary?.amount)) + (Number(paymentSummary?.fees?.processing_fee)) + (Number(paymentSummary?.fees?.system_fee))

    /* UI Style Update: Text color from Purple to Dark Green */
    if (!paymentSummary) return <p className="text-center mt-10 text-[#064e3b]">No payment details available.</p>;

    const formattedDate = new Date().toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });

    return (
        /* UI Style Update: Background gradient stop changed to Light Green/Teal */
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-br from-[#FFFFFF] to-[#E6F4F1] p-2 font-sans">
        
            {/* Header Section */}
            <div className="flex flex-col items-center mb-4">
                <div className="w-20 h-20 bg-gray-300 rounded-full mb-2 shadow-inner" />
                {/* UI Style Update: Text color to Dark Green */}
                <h2 className="text-[#064e3b] text-lg font-bold">{merchantName}</h2>
                <div className="flex gap-2 mt-1 text-[#064e3b]">
                    {/* <Facebook size={16} className="cursor-pointer hover:opacity-70 transition-opacity" />
                    <Instagram size={16} className="cursor-pointer hover:opacity-70 transition-opacity" />
                    <Link2 size={16} className="cursor-pointer hover:opacity-70 transition-opacity" /> */}
                </div>
            </div>

            {/* Main Failed Card */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
                <div className="p-8 md:p-10 flex flex-col items-center text-center">
                
                    {/* Failed Icon (Keeping Red for status clarity) */}
                    <div className="mb-4">
                        <XCircle 
                            size={56} 
                            color="#E5484D"   
                            strokeWidth={2.5} 
                            />
                    </div>

                    {/* Header */}
                    {/* UI Style Update: Text color to Dark Green */}
                    <h1 className="text-[#064e3b] text-xl md:text-2xl font-bold mb-1">Payment Failed</h1>
                    
                    {/* Instructional Text */}
                    <p className="text-[#6F7282] text-xs md:text-sm leading-snug mb-8">
                        We couldn't process your payment at this time.
                    </p>

                    {/* Amount Display */}
                    <div className="mb-8">
                        {/* UI Style Update: Span color to Emerald Green */}
                        <p className="text-xs md:text-sm text-[#064e3b]">
                            Your payment to <span className="text-[#10b981] font-medium cursor-pointer">{merchantName}</span>
                        </p>
                        {/* UI Style Update: Text color to Dark Green */}
                        <h2 className="text-3xl font-bold text-[#064e3b] my-1">
                            ₱ {Number(totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h2>
                        <p className="text-xs md:text-sm text-[#064e3b]">was not completed.</p>
                    </div>

                    {/* Status Info */}
                    <div className="mb-8">
                        <p className="text-[#6F7282] text-xs mb-1">{formattedDate}</p>
                        <p className="text-[#064e3b] text-xs md:text-sm max-w-70 leading-relaxed">
                            Please try again or choose a different payment method.
                        </p>
                    </div>

                    {/* Action Button */}
                    <div className="w-full flex justify-center">
                        <button 
                            /* UI Style Update: Gradient to Dark Green/Emerald */
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

export default FailedModal;