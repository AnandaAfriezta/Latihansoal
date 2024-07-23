"use client";

import React, { useEffect, useState } from "react";
import DetailQuestions, { AnswerObject } from "@/app/components/detailQuestions";
import Link from "next/link";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import EmojiFlagsRoundedIcon from "@mui/icons-material/EmojiFlagsRounded";
import SubmitUjian from "@/app/components/modal/submitUjian";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [namaLatihanSoal, setNamaLatihanSoal] = useState('');
  const [answeredCount, setAnsweredCount] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);

  const selectSound = new Audio("/sounds/select-sound.mp3");

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
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
    const newAnsweredCount = data.filter((soal: { jawaban: AnswerObject[] }) =>
      soal.jawaban.some(jawaban => jawaban.jawaban_user === true)
    ).length;
    
    setAnsweredCount(newAnsweredCount);
  };
  
  const handleFlagQuestion = (index: number) => {
    setFlaggedQuestions((prevFlaggedQuestions) => {
      if (prevFlaggedQuestions.includes(index)) {
        return prevFlaggedQuestions.filter((item) => item !== index);
      } else {
        return [...prevFlaggedQuestions, index];
      }
    });
  };

  const answeredCountTest = data.filter((soal: { jawaban: any[]; }) => soal.jawaban.some(jawaban => jawaban.jawaban_user === true)).length;

  const answeredPercentage = (answeredCountTest / data.length) * 100;

  const playSound = () => {
    selectSound.play();
  };

  return (
    <div className="w-full h-screen bg-white py-8">
      <div className="w-full max-w-screen-md mx-auto px-4">
        <div
          className="flex w-full items-center justify-between mt-3 mb-6 pb-4"
          style={{ boxShadow: "0 2px 0 0 #CACACA40" }}
        >
          <Link href="/">
            <ArrowBackIosNewRoundedIcon className="text-black cursor-pointer" />
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
              onClick={toggleModal}
              className="cursor-pointer"
            />
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="absolute inset-0 bg-black opacity-50" onClick={toggleModal}></div>
                <div className="bg-white shadow-md rounded-2xl flex flex-col p-4 z-10 max-h-[80vh] overflow-auto">
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
                        const isFlagged = flaggedQuestions.includes(index);
                        return (
                          <button
                            key={index}
                            className="block hover:bg-gray-200 focus:bg-gray-200 rounded-md m-2"
                            onClick={() => {
                              setStartIndex(index * itemsPerPage);
                              toggleModal();
                            }}
                            style={{
                              backgroundColor: isAnswered ? "#9E62CE" : "white",
                              color: isAnswered ? "white" : "black",
                              border: isFlagged ? '2px solid orange' : 'none',
                              width: '40px',
                              height: '35px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {index + 1}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="text-black font-semibold flex w-full items-center justify-between mb-3">
          <div className="text-sm">
            Soal {startIndex + 1} dari {data.length}
          </div>
          <div>
            <button
              className={`flex items-center rounded-md p-1 text-xs ${flaggedQuestions.includes(startIndex) ? 'border-orange-500 border-2' : ''}`}
              onClick={() => handleFlagQuestion(startIndex)}
            >
              Tandai Soal
              <Image
                src="/flag.svg"
                alt="flag"
                width={7}
                height={7}
                className="ms-2"
              />
            </button>
          </div>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-md overflow-hidden mb-5">
          <div
            className="bg-green-500 h-full"
            style={{
              width: `${answeredPercentage}%`,
              transition: "width 0.5s ease-in-out",
            }}
          />
        </div>
        <div className="flex flex-col gap-4 items-center w-full">
          <div
            className="w-full overflow-y-auto px-3"
            style={{ maxHeight: '58vh'}}
          >
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
                  playSound={playSound}
                />
              ))}
          </div>
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
              <ArrowBackIosNewRoundedIcon/>
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
              <ArrowForwardIosRoundedIcon/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetail;
