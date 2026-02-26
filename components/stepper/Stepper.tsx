import React from "react";

interface StepperProps {
  steps: string[];
  currentStep: number; // 1-based index
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center w-full max-w-[120px] mx-auto mb-6">
      {steps.map((step, idx) => {
        const stepNum = idx + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        
        // Line is green if the step it's coming from is active or completed
        const isLineActive = stepNum < currentStep;

        return (
          <React.Fragment key={step}>
            {/* Step Circle */}
            <div
              className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full border-[2px] text-xs font-bold transition-all duration-300 ${
                isActive || isCompleted
                  ? "bg-gradient-to-r from-[#064e3b] to-[#10b981] border-[#064e3b] text-white"
                  : "bg-white border-[#d1d5db] text-[#6b7280]"
              }`}
            >
              {stepNum}
            </div>

            {/* Connecting Line */}
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-[2px] transition-colors duration-300 ${
                  isLineActive ? "bg-[#064e3b]" : "bg-[#d1d5db]"
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