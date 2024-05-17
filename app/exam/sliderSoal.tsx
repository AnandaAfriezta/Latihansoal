"use client";

import React from "react";

interface SliderSoalProps {
  questionNumber: number;
  isActive: boolean;
  onClick: () => void;
}

const SliderSoal: React.FC<SliderSoalProps> = ({
  questionNumber,
  isActive,
  onClick,
}) => {
  return (
    <button
      className={`w-full flex bg-white justify-center items-center rounded-lg p-2 hover:outline hover:outline-2 hover:outline-slate-500 ${
        isActive ? "bg-gray-300" : ""
      }`}
      onClick={onClick}
    >
      <h1 className="text-xl font-bold text-slate-800">{questionNumber}</h1>
    </button>
  );
};

export default SliderSoal;
