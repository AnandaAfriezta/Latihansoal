"use client";

import React, { useEffect, useState } from "react";
import DetailQuestions from "@/app/components/detailQuestions";
import Link from "next/link";
import SubmitUjian from "@/app/components/modal/submitUjian";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Image from "next/image";
import Cookies from "js-cookie";

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
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const fetchData = async (id_latihan_soal: number) => {
    const res = await fetch(`${apiUrl}/ujian/${id_latihan_soal}/get-all-soal`, {
      method: "GET",
      cache: "no-store",
    });
    const result = await res.json();
    console.log(Cookies.get("user"));

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
    <div className="w-full h-screen h-full bg-white py-8">
      <div className="w-full max-w-screen-md mx-auto px-4">
        <div
          className="flex w-full items-center justify-between mt-3 mb-6 pb-4"
          style={{ boxShadow: "0 2px 0 0 #CACACA40" }}
        >
          <Link href={"/"}>
            <ArrowBackIosNewIcon className="text-black" />
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
            />
            {isPopupOpen && (
              <div className="absolute top-8 right-0 bg-white shadow-md rounded-md">
                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    className="block px-3 py-1 hover:bg-gray-200 focus:bg-gray-200"
                    onClick={() =>
                      setStartIndex((pageNumber - 1) * itemsPerPage)
                    }
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="text-black font-semibold mb-8">
          Soal {startIndex + 1} dari {data.length}
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
              <SubmitUjian {...params} isDisabled={!isAtEnd} />
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
