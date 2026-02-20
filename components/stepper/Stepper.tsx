import React from "react";

interface StepperProps {
  steps: string[];
  currentStep: number; // 1-based index
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center w-full max-w-[250px] mx-auto mb-6">
      {steps.map((step, idx) => {
        const stepNum = idx + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        
        // Logic to match the image: Line is blue if the step it's coming from is active or completed
        const isLineActive = stepNum < currentStep || (stepNum === currentStep && idx < steps.length - 1);

        return (
          <React.Fragment key={step}>
            {/* Step Circle */}
            <div
              className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-[3px] text-sm font-bold transition-colors duration-300 ${
                isActive || isCompleted
                  ? "bg-[#1d63ff] border-[#1d63ff] text-white"
                  : "bg-white border-[#646c7f] text-[#1a1a1a]"
              }`}
            >
              {stepNum}
            </div>

            {/* Connecting Line */}
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-[3px] transition-colors duration-300 ${
                  isLineActive ? "bg-[#1d63ff]" : "bg-[#646c7f]"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;