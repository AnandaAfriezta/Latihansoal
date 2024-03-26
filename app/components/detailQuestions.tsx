// DetailQuestions.tsx

import React, { useState } from 'react';
import DetailAnswer from './detailAnswer';

interface AnswerObject {
  id_jawaban: number;
  konten_jawaban: string;
}

interface DetailQuestionsProps {
  id_soal: number;
  konten_soal: string;
  jawaban: AnswerObject[];
}

const DetailQuestions: React.FC<DetailQuestionsProps> = ({
  id_soal,
  konten_soal,
  jawaban,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

  const handleAnswerClick = (index: number) => {
    
    setSelectedAnswers((prevSelectedAnswers) => {
      const newSelectedAnswers = [...prevSelectedAnswers];
      newSelectedAnswers[id_soal - 1] = index;
      return newSelectedAnswers;
    });
  };

  const getSelectedAnswerIndex = () => {
    // Mendapatkan indeks jawaban yang dipilih untuk soal ini
    return selectedAnswers[id_soal - 1];
  };

  return (
    <div className="w-full flex flex-col justify-start">
      <p className="text-gray-800 font-semibold mb-8">{konten_soal}</p>

      <ol className="w-full flex flex-col">
        {jawaban.map((item: AnswerObject, index: number) => (
          <DetailAnswer
            key={index}
            id_jawaban={item.id_jawaban}
            konten_jawaban={item.konten_jawaban}
            isSelected={index === getSelectedAnswerIndex()}
            onAnswerClick={() => handleAnswerClick(index)}
          />
        ))}
      </ol>
    </div>
  );
};

export default DetailQuestions;
