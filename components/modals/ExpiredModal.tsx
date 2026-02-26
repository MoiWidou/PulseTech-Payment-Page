import React from "react";
import Lottie from "lottie-react";
import loading from "../../src/assets/animations/loading.json";
import { useParams, useNavigate } from "react-router-dom";

const ExpiredModal: React.FC = () => {
    const { merchant_username } = useParams();
    const navigate = useNavigate();

    return (
        /* UI Style Update: Background gradient changed to Light Green/Teal */
<<<<<<< HEAD
        <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-[#FFFFFF] to-[#C9FCE9]">
=======
        <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-[#FFFFFF] to-[#E6F4F1]">
>>>>>>> 6e3ec55 (Change color scheme)
            <div className="flex items-center justify-center">
                <Lottie animationData={loading} loop={true} className="w-full md:w-70" />
            </div>

            {/* UI Style Update: Text gradient changed to Dark Green/Emerald */}
            <h1 className="text-4xl font-bold bg-linear-to-br from-[#064e3b] to-[#10b981] bg-clip-text text-transparent p-5 text-center">
                Oops! This link timed out.
            </h1>

            {/* UI Style Update: Text gradient changed to Dark Green/Emerald */}
            <h2 className="text-sm max-w-xs bg-linear-to-br from-[#064e3b] to-[#10b981] bg-clip-text text-transparent font-normal mb-5 text-center">
                Looks like this payment session has expired. Let’s get you back on track.
            </h2>

            <button
                /* UI Style Update: Button gradient changed to Dark Green/Emerald */
                className="w-[60%] md:w-full mx-auto max-w-60 bg-[#202122] text-[#75EEA5] cursor-pointer hover:from-[#1B2A27] hover:shadow-lg hover:-translate-y-0.5 active:scale-95 font-semibold py-2.5 px-4 rounded-lg transition-all shadow-md text-xs"
                onClick={() => navigate(`/${merchant_username}`)}
            >
                Make Another Payment
            </button>
        </div>
    );
};

export default ExpiredModal;