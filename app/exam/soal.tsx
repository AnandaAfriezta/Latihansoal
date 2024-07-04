"use client";

import { useState, useEffect } from "react";
import DetailQuestions from "@/app/components/detailQuestions";

interface SoalDataItem {
  id_soal: number;
  konten_soal: string;
  jawaban: string;
}

async function getSoal(id_latihan_soal: number) {
  const res = await fetch(
    `http://10.191.1.204:5000/ujian/${id_latihan_soal}/get-all-soal`,
    {
      method: "GET",
      cache: "no-store",
    },
  );
  const data = await res.json();
  return data;
}

interface DetailUjianProps {
  params: {
    id_latihan_soal: number;
  };
}

export default function ExamDetail({ params }: DetailUjianProps) {
  const [soalData, setSoalData] = useState<SoalDataItem[]>([]);
  const [startQuestion, setStartQuestion] = useState(0);
  const [endQuestion, setEndQuestion] = useState(9);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSoal(params.id_latihan_soal);
      setSoalData(data);
      setAnswers(new Array(data.length).fill(""));
    };

    fetchData();
  }, [params.id_latihan_soal]);

  const handleSliderChange = (value: any) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = value;
    setAnswers(updatedAnswers);
  };

  const handleNextSlide = () => {
    const newEndQuestion = Math.min(endQuestion + 10, soalData.length - 1);
    setStartQuestion(endQuestion + 1);
    setEndQuestion(newEndQuestion);
  };

  const handlePrevSlide = () => {
    const newStartQuestion = Math.max(startQuestion - 10, 0);
    setStartQuestion(newStartQuestion);
    setEndQuestion(newStartQuestion + 9);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < soalData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div className="w-full h-screen bg-slate-100 py-8">
      <div className="w-full max-w-screen-md mx-auto px-4">
        <p>{params.id_latihan_soal}</p>

        <div className="flex flex-col gap-4 items-center">
          {soalData.map((item: any, index: number) => {
            return (
              <DetailQuestions
                key={index}
                id_soal={item.id_soal}
                konten_soal={item.konten_soal}
                jawaban={item.jawaban}
                id_latihan_soal={0}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
