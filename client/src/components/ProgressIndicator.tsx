import { useLanguage } from "@/contexts/LanguageContext";
import { Check } from "lucide-react";

type Step = "width" | "height" | "rim";

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: Step;
}

const StepCircle = ({
  isCompleted,
  isActive,
}: {
  isCompleted: boolean;
  isActive: boolean;
}) => (
  <div
    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300
    ${
      isCompleted
        ? "bg-electric-blue text-white"
        : isActive
        ? "border-2 border-electric-blue bg-white"
        : "bg-gray-300"
    }`}
  >
    {isCompleted && <Check size={20} />}
  </div>
);

const Connector = ({ isCompleted }: { isCompleted: boolean }) => (
  <div className="flex-1 flex items-center justify-center px-2">
    <div className="flex items-center justify-between w-full">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full
          ${isCompleted ? "bg-electric-blue" : "bg-gray-300"}`}
        ></div>
      ))}
    </div>
  </div>
);

export const ProgressIndicator = ({
  steps,
  currentStep,
}: ProgressIndicatorProps) => {
  const { t } = useLanguage();
  const stepTranslations: Record<Step, string> = {
    width: t("width"),
    height: t("height"),
    rim: t("rim_size"),
  };

  const currentStepIndex = steps.indexOf(currentStep);

  return (
    <div className="flex items-center w-full my-8">
      {steps.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isActive = index === currentStepIndex;

        return (
          <>
            <div className="flex flex-col items-center" key={step}>
              <StepCircle isCompleted={isCompleted} isActive={isActive} />
              <p className="mt-2 text-sm font-medium">{stepTranslations[step]}</p>
            </div>
            {index < steps.length - 1 && (
              <Connector isCompleted={isCompleted} />
            )}
          </>
        );
      })}
    </div>
  );
}; 