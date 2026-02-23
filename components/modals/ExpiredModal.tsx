import React from "react";
import Lottie from "lottie-react";
import loading from "../../src/assets/animations/loading.json";
import { useParams, useNavigate } from "react-router-dom";

const ExpiredModal: React.FC = () => {
    const { merchant_username } = useParams();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-[#FFFFFF] to-[#D0BBE6]">
            <div className="flex items-center justify-center">
                <Lottie animationData={loading} loop={true} className="w-full md:w-150" />
            </div>

            <h1 className="text-9xl font-bold bg-linear-to-br from-[#2B3565] to-[#0171A3] bg-clip-text text-transparent p-5 mt-10">
                Oops! This link timed out.
            </h1>

            <h2 className="text-3xl font-semibold mb-5 text-center">
                Looks like this payment session has expired. Let’s get you back on track.
            </h2>

            <button
                className="w-[60%] md:w-full mx-auto max-w-60 bg-linear-to-r from-[#2B3565] to-[#0171A3] hover:from-[#312B5B] hover:to-[#0182B5] hover:shadow-lg hover:-translate-y-0.5 active:scale-95 text-white font-semibold py-2.5 px-4 rounded-lg transition-all shadow-md text-xs"
                onClick={() => navigate(`/${merchant_username}`)}
            >
                Make Another Payment
            </button>
        </div>
    );
};

export default ExpiredModal;