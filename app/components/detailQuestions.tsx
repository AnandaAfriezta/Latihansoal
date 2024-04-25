import React, { useState, useEffect } from "react";
import DetailAnswer from "./detailAnswer";
import Cookies from "js-cookie";

interface AnswerObject {
  id_latihan_soal: number;
  id_jawaban: number;
  konten_jawaban: string;
  isSelected: boolean;
  onAnswerClick: (idJawaban: number) => void;
}

interface DetailQuestionsProps {
  id_soal: number;
  konten_soal: string;
  jawaban: AnswerObject[];
  id_latihan_soal: number;
}

const DetailQuestions: React.FC<DetailQuestionsProps> = ({
  id_soal,
  konten_soal,
  jawaban,
  id_latihan_soal,
}) => {
  // State untuk menyimpan jawaban yang dipilih untuk setiap soal
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number;
  }>({});

  useEffect(() => {
    // Retrieve selectedAnswers from cookies
    const selectedAnswersFromCookieString = Cookies.get("selectedAnswers");
    if (selectedAnswersFromCookieString) {
      const selectedAnswersFromCookie = JSON.parse(
        selectedAnswersFromCookieString
      );
      setSelectedAnswers(selectedAnswersFromCookie);
    }
  }, []);

  const handleAnswerClick = (index: number) => {
    setSelectedAnswers((prevSelectedAnswers) => ({
      ...prevSelectedAnswers,
      [id_soal]: index, // Menyimpan indeks jawaban yang dipilih untuk soal tertentu
    }));

    // Simpan jawaban yang dipilih ke dalam cookies
    Cookies.set(
      "selectedAnswers",
      JSON.stringify({ ...selectedAnswers, [id_soal]: index })
    );
  };

  const getSelectedAnswerIndex = () => {
    return selectedAnswers[id_soal];
  };

  return (
    <div className="w-full flex flex-col justify-start">
      <p className="text-gray-800 font-semibold mb-8">{konten_soal}</p>

      <ol className="w-full flex flex-col">
        {jawaban.map((item: AnswerObject, index: number) => (
          <DetailAnswer
            key={index}
            id_latihan_soal={id_latihan_soal}
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
