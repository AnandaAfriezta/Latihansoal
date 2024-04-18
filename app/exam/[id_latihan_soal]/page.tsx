"use client";

import React, { useEffect, useState } from "react";
import DetailQuestions from "@/app/components/detailQuestions";
import Link from "next/link";
import SubmitUjian from "@/app/components/modal/submitUjian";

interface detailUjianProps {
  params: {
    id_latihan_soal: number;
    nama_latihansoal: string;
  };
}
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const ExamDetail: React.FC<detailUjianProps> = ({ params }) => {
  const { id_latihan_soal } = params;
  const { nama_latihansoal } = params;

  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 1;
  const [data, setData] = useState([]);
  const [duration, setDuration] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);

  const fetchData = async (id_latihan_soal: number) => {
    const res = await fetch(
      `${apiUrl}/ujian/${id_latihan_soal}/get-all-soal`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    const result = await res.json();

    if (result.success) {
      setData(result.data.soalData);
      setDuration(result.data.durasi * 60);
      setRemainingTime(result.data.durasi * 60);
    }
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

  useEffect(() => {
    fetchData(params.id_latihan_soal);
  }, [params.id_latihan_soal]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime((prevRemainingTime) =>
        prevRemainingTime > 0 ? prevRemainingTime - 1 : 0
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, [params.id_latihan_soal]);

  const isAtStart = startIndex === 0;
  const isAtEnd = startIndex + itemsPerPage >= data.length;

  const calculatePageNumbers = () => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const currentPage = Math.floor(startIndex / itemsPerPage) + 1;

    const pageRange = 10;
    const startPage = Math.max(1, currentPage - Math.floor(pageRange / 1));
    const endPage = Math.min(totalPages, startPage + pageRange - 1);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    );
  };

  const pageNumbers = calculatePageNumbers();

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="w-full h-screen h-full bg-slate-100 py-8 justify-center items-center flex">
      <div className="w-full h-s max-w-screen-md mx-auto px-4">
        <div className="flex w-full max-w-screen-md justify-between absolute top-8 left-0 right-0 px-4 mx-auto">
          <div className="grid gap-2 grid-cols-10">
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setStartIndex((pageNumber - 1) * itemsPerPage)}
                className={`btn btn-ghost hover:bg-accent hover:text-white gap-y-2 ${
                  (pageNumber - 1) * itemsPerPage === startIndex
                    ? "bg-accent text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                {pageNumber}
              </button>
            ))}
          </div>
          <div>
            <button
              className="btn btn-accent mx-1 bg-accent text-white focused"
              disabled={remainingTime <= 0}
            >
              {formatTime(remainingTime)}
            </button>
          </div>
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
              />
            ))}
        </div>

        <div className="flex flex-col mt-4 gap-4 absolute bottom-0 right-0 left-0 w-full">
          <div className="flex w-full justify-between max-w-screen-md mx-auto px-4">
            <button
              onClick={handleBack}
              disabled={isAtStart}
              className="btn btn-accent text-white"
              style={{ visibility: isAtStart ? "hidden" : "visible" }}
            >
              Prev
            </button>
            <button
              onClick={handleNext}
              disabled={isAtEnd}
              className="btn btn-accent text-white"
              style={{ visibility: isAtEnd ? "hidden" : "visible" }}
            >
              Next
            </button>
          </div>
          <div>
          <SubmitUjian
            {...params}
            isDisabled={!isAtEnd}
          />
        </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetail;
