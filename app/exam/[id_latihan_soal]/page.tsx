"use client";

import React, { useEffect, useState } from "react";
import DetailQuestions, { AnswerObject } from "@/app/components/detailQuestions";
import Link from "next/link";
import SubmitUjian from "@/app/components/modal/submitUjian";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Image from "next/image";
import Cookies from "js-cookie";

interface DetailUjianProps {
  params: {
    id_latihan_soal: number;
  };
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const ExamDetail: React.FC<DetailUjianProps> = ({ params }) => {
  const { id_latihan_soal } = params;

  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 1;
  const [data, setData] = useState<any[]>([]);
  const [duration, setDuration] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [namaLatihanSoal, setNamaLatihanSoal] = useState('');
  const [answeredCount, setAnsweredCount] = useState(0);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("UserToken");
        if (!token) {
          throw new Error("User data not found. Please login again.");
        }

        const res = await fetch(`${apiUrl}/ujian/${id_latihan_soal}/get-all-soal`, {
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        
        const result = await res.json();
        
        if (result.success) {
          const soalData = result.data.soalData;
          
          setData(soalData);
          setDuration(result.data.durasi * 60);
          setRemainingTime(result.data.durasi * 60);
          setNamaLatihanSoal(result.data.nama_latihansoal);

          const answeredCount = soalData.filter((soal: { jawaban: any[]; }) => soal.jawaban.some(jawaban => jawaban.jawaban_user === true)).length;
          setAnsweredCount(answeredCount);
  
          if (result.data.hasCompleted) {
            setHasCompleted(true);
            resetForm();
          } else {
            setHasCompleted(false);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      setRemainingTime((prevRemainingTime) =>
        prevRemainingTime > 0 ? prevRemainingTime - 1 : 0
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, [id_latihan_soal]);

  useEffect(() => {
    // const answeredCount = data.filter((soal: { jawaban: any[]; }) => soal.jawaban.some(jawaban => jawaban.jawaban_user === true)).length;
    // setAnsweredCount(answeredCount);
    // console.log(answeredCount)
    console.log("data change")
  }, [data])
  

  const resetForm = () => {
    setData([]);
    setStartIndex(0);
    setRemainingTime(duration);
  };

  const handleNext = () => {
    if (startIndex + itemsPerPage < data.length) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  const handleBack = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };

  const isAtStart = startIndex === 0;
  const isAtEnd = startIndex + itemsPerPage >= data.length;

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleAnswerQuestion = () => {
    // Menghitung berapa banyak soal yang sudah dijawab
    const newAnsweredCount = data.filter((soal: { jawaban: AnswerObject[] }) =>
      soal.jawaban.some(jawaban => jawaban.jawaban_user === true)
    ).length;
    
    setAnsweredCount(newAnsweredCount);
  };
  
  const answeredCountTest = data.filter((soal: { jawaban: any[]; }) => soal.jawaban.some(jawaban => jawaban.jawaban_user === true)).length

  const answeredPercentage = (answeredCountTest / data.length) * 100;

  return (
    <div className="w-full h-screen bg-white py-8">
      <div className="w-full max-w-screen-md mx-auto px-4">
        <div
          className="flex w-full items-center justify-between mt-3 mb-6 pb-4"
          style={{ boxShadow: "0 2px 0 0 #CACACA40" }}
        >
          <Link href="/">
            <ArrowBackIosNewIcon className="text-black cursor-pointer" />
          </Link>
          <div>
            <button
              className="bg-[#9E62CE] px-3 py-1 rounded-md text-white font-semibold text-md"
              disabled={remainingTime <= 0}
            >
              {formatTime(remainingTime)}
            </button>
          </div>
          <div className="relative">
            <Image
              src="/tab.png"
              alt="tab"
              width={20}
              height={20}
              onClick={togglePopup}
              className="cursor-pointer"
            />
            {isPopupOpen && (
              <div className="absolute top-15 right-10 bg-white shadow-md rounded-md flex flex-col p-2">
                {Array.from({
                  length: Math.ceil(data.length / 10),
                }).map((_, rowIndex) => (
                  <div key={rowIndex} className="flex mb-1">
                    {Array.from({
                      length: Math.min(10, data.length - rowIndex * 10),
                    }).map((_, colIndex) => {
                      const index = rowIndex * 10 + colIndex;
                      const isAnswered = data[index]?.jawaban.some(
                        (jawaban: any) => jawaban.jawaban_user === true
                      );
                      return (
                        <button
                          key={index}
                          className="block hover:bg-gray-200 focus:bg-gray-200 rounded-md m-1"
                          onClick={() => setStartIndex(index * itemsPerPage)}
                          style={{
                            backgroundColor: isAnswered ? "#9E62CE" : "white",
                            color: isAnswered ? "white" : "black",
                            width: '30px',  // fixed width
                            height: '30px', // fixed height
                            display: 'flex', // ensure proper alignment
                            alignItems: 'center', // center vertically
                            justifyContent: 'center', // center horizontally
                          }}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="text-black font-semibold mb-3">
          Soal {startIndex + 1} dari {data.length} (Sudah dijawab: {answeredCountTest})
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-md overflow-hidden mb-5">
          <div
            className="bg-green-500 h-full"
            style={{ width: `${answeredPercentage}%` }}
          />
        </div>
        <div className="flex flex-col gap-4 items-center w-full">
        {data
          .slice(startIndex, startIndex + itemsPerPage)
          .map((item: any, index: number) => (
            <DetailQuestions
              key={index}
              id_soal={item.id_soal}
              konten_soal={item.konten_soal}
              jawaban={item.jawaban}
              id_latihan_soal={params.id_latihan_soal}
              onAnswerQuestion={handleAnswerQuestion}
            />
          ))}
        </div>

        <div className="flex flex-col mt-4 gap-4 absolute bottom-8 right-0 left-0 w-full">
          <div className="flex w-full justify-between max-w-screen-md mx-auto px-4">
            <button
              onClick={handleBack}
              disabled={isAtStart}
              className="bg-[#E3D9CA] px-4 rounded-xl text-[#515151] font-extrabold text-2xl"
              style={{
                visibility: isAtStart ? "hidden" : "visible",
                boxShadow: "0 3px 0 0 #B1A6A6",
              }}
            >
              &lt;
            </button>
            <div>
              {!hasCompleted && (
                <SubmitUjian
                  id_latihan_soal={id_latihan_soal}
                  nama_latihan_soal={namaLatihanSoal}
                  isDisabled={remainingTime <= 0 || answeredCount < data.length}
                  totalSoal={data.length}
                  jawabanUser={answeredCountTest}
                  onCheckAnswers={() => setAnsweredCount(answeredCount)}
                />
              )}
            </div>
            <button
              onClick={handleNext}
              disabled={isAtEnd}
              className="bg-[#E3D9CA] px-4 rounded-xl text-[#515151] font-extrabold text-2xl"
              style={{
                visibility: isAtEnd ? "hidden" : "visible",
                boxShadow: "0 3px 0 0 #B1A6A6",
              }}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetail;
