import Lottie from "lottie-react";
import catAnimation from "../src/assets/animations/Loader cat.json";

const NotFound: React.FC = () => (
  /* UI Style Update: Background gradient stop changed to Light Green/Teal */
  <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-[#FFFFFF] to-[#E6F4F1]">
        
        {/* UI Style Update: Text gradient changed to Dark Green/Emerald */}
        <h1 className="text-9xl font-bold bg-linear-to-br from-[#064e3b] to-[#10b981] bg-clip-text text-transparent p-5 mt-10">
            404
        </h1>
        
        {/* UI Style Update: Text color set to Dark Green for better visibility */}
        <h2 className="text-3xl font-semibold mb-5 text-center text-[#064e3b]">
            Oops! This page can't be found.
        </h2>
        
        <h3 className="max-w-sm text-center text-[#6F7282]">
            Looks like this payment link didn’t make it through. Let’s get you back on track.
        </h3>

    <div className="flex items-center justify-center">
        <Lottie animationData={catAnimation} loop={true} className="w-full md:w-150"/>
    </div>
  </div>
);

export default NotFound;