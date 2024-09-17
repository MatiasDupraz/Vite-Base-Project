import React, { useState } from "react";
import "./stepper.css";
import { TiTick } from "react-icons/ti";
const Stepper = ({ step }) => {
  const steps = ["Resumen", "Envío", "Contacto", "Pago"];
  const [currentStep, setCurrentStep] = useState(step);
  const [complete, setComplete] = useState(false);
  return (
    <React.Fragment>
      <div className="flex justify-center">
        {steps?.map((step, i) => (
          <div
            key={i}
            className={`step-item ${currentStep === i + 1 && "active"} ${
              (i + 1 < currentStep || complete) && "complete"
            } `}
          >
            <div className="step">
              {i + 1 < currentStep || complete ? <TiTick size={24} /> : i + 1}
            </div>
            <p className="text-gray-500">{step}</p>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

export default Stepper;
