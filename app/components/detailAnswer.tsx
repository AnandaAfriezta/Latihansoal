// Import React
import React from "react";

interface AnswerObject {
  id_jawaban: number;
  konten_jawaban: string;
  isSelected: boolean;
  onAnswerClick: (idJawaban: number) => void;
}

const DetailAnswer: React.FC<AnswerObject> = ({
  id_jawaban,
  konten_jawaban,
  isSelected,
  onAnswerClick,
}) => {

  return (
    <div className="w-full mb-2">
      <label
        className={`flex items-center bg-white rounded-xl border border-[#999CA1] py-2 px-4 text-black justify-between w-full mb-2 `}
      >

        <input
          type="radio"
          onClick={() => onAnswerClick(id_jawaban)}
          checked={isSelected}
          className="custom-radio"
        />
        <span className="flex-grow ml-5">{konten_jawaban}</span>
      </label>
    </div>
  );
};

// Export komponen DetailAnswer
export default DetailAnswer;
