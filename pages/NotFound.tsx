import Lottie from "lottie-react";
import catAnimation from "../src/assets/animations/Loader cat.json";

const NotFound: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-[#FFFFFF] to-[#D0BBE6]">
        <h1 className="text-9xl font-bold bg-linear-to-br from-[#2B3565] to-[#0171A3] bg-clip-text text-transparent p-5 mt-10">
            404
        </h1>
        <h2 className="text-3xl font-semibold mb-5 text-center">
            Oops! This page can't be found.
        </h2>
        <h3 className="max-w-sm text-center">
            Looks like this payment link didn’t make it through. Let’s get you back on track.
        </h3>
    <div className="flex items-center justify-center">
        <Lottie animationData={catAnimation} loop={true} className="w-150"/>
    </div>
  </div>
);

export default NotFound;
