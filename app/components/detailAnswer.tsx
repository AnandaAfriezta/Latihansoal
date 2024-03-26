'use client';

import React from 'react';

interface AnswerObject {
  id_jawaban: number;
  konten_jawaban: string;
  isSelected: boolean;
  onAnswerClick: () => void;
}

const DetailAnswer: React.FC<AnswerObject> = ({
  id_jawaban,
  konten_jawaban,
  isSelected,
  onAnswerClick,
}) => {
  return (
    <div className="w-full mb-2">
      <button
        onClick={onAnswerClick}
        className={`btn w-full btn-ghost focus:bg-accent justify-start focus:text-white ${
          isSelected ? 'bg-accent text-white' : ''
        }`}
      >
        {konten_jawaban}
      </button>
    </div>
  );
};

export default DetailAnswer;
