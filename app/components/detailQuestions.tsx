import React, { useEffect, useState } from "react";
import DetailAnswer from "./detailAnswer";

export interface AnswerObject {
  id_latihan_soal: number;
  id_jawaban: number;
  konten_jawaban: string;
  jawaban_user: boolean;  // expecting boolean in string form
  isSelected: boolean;
  onAnswerClick: (idJawaban: number) => void;
}

interface DetailQuestionsProps {
  id_soal: number;
  konten_soal: string;
  jawaban: AnswerObject[];
  id_latihan_soal: number;
  onAnswerQuestion: () => void;
  playSound: () => void; // Tambahkan prop untuk memainkan suara
}

const DetailQuestions: React.FC<DetailQuestionsProps> = ({
  id_soal,
  konten_soal,
  jawaban,
  id_latihan_soal,
  onAnswerQuestion,
  playSound, // Tambahkan prop untuk memainkan suara
}) => {
  // Find the initial selected answer id
  const initialSelectedAnswerId = jawaban.find(answer => answer.jawaban_user === true)?.id_jawaban || null;
  
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(initialSelectedAnswerId);

  useEffect(() => {
    // Re-initialize selectedAnswerId when `jawaban` changes
    const newSelectedAnswerId = jawaban.find(answer => answer.jawaban_user === true)?.id_jawaban || null;
    setSelectedAnswerId(newSelectedAnswerId);
  }, [jawaban]);

  const handleAnswerClick = (id_jawaban: number) => {
    setSelectedAnswerId(id_jawaban);
    // Optionally, update the `jawaban` array to reflect the selected answer
    jawaban.forEach(answer => {
      answer.jawaban_user = answer.id_jawaban === id_jawaban;
    });
    playSound(); // Panggil fungsi untuk memainkan suara ketika jawaban dipilih
  };

  return (
    <div className="w-full flex flex-col justify-start">
      <p className="text-gray-800 font-semibold mb-8">{konten_soal}</p>
      <p>{JSON.stringify(jawaban)}</p>
      <ol className="w-full flex flex-col">
        {jawaban.map((item) => (
          <DetailAnswer
            key={item.id_jawaban}
            id_latihan_soal={id_latihan_soal}
            id_jawaban={item.id_jawaban}
            konten_jawaban={item.konten_jawaban}
            isSelected={selectedAnswerId === item.id_jawaban}
            onAnswerClick={() => handleAnswerClick(item.id_jawaban)}
          />
        ))}
      </ol>
    </div>
  );
};

export default DetailQuestions;
