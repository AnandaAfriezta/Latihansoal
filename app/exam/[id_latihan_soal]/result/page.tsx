"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import CardDetailresult from "@/app/components/card/cardDetailresult";
import Cookies from "js-cookie";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Link from "next/link";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";


const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getResult(id_latihan_soal: number) {
  try {
    const token = Cookies.get("UserToken");
    console.log("Current cookie:", token);
    if (!token) {
      throw new Error("User data not found. Please login again.");
    }

    const res = await fetch(`${apiUrl}/ujian/${id_latihan_soal}/finish`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch data from API");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

interface ExamResultProps {
  params: {
    id_latihan_soal: number;
  };
}

interface Result {
  nama_latihansoal: string;
  durasi: number;
  soalData: soalData[];
  nilai_akhir: number;
  jumlahBenar: number;
  jumlahSalah: number;
}

interface soalData {
  id_soal: number;
  konten_soal: string;
  pembahasan: string;
  jawaban: jawaban[];
}

interface jawaban {
  id_jawaban: number;
  konten_jawaban: string;
  jawaban_benar: string;
  jawaban_user: boolean;
}

export default function ExamResult({ params }: ExamResultProps) {
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    getResult(params.id_latihan_soal)
      .then((data) => {
        if (data && data.data) {
          setResult(data.data);
        } else {
          console.error("No data received or incorrect data structure");
        }
        console.log(data);
      })
      .catch((error) => console.error(error));
  }, [params.id_latihan_soal]);

  if (!result) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full bg-slate-100 p-8">
      <div className="w-full max-w-screen-md mx-auto px-4 bg-slate-100">
        
        <div className="grid w-full">
          <Link href="/">
            <ArrowBackIosNewIcon className="text-black cursor-pointer mb-5" />
          </Link>

          <div className="flex justify-center bg-white p-8 rounded-xl shadow-md">
            <div className="bg-white p-8 rounded-xl max-w-screen-md">
              <h1 className="text-2xl font-semibold text-black text-center">
                {result.nama_latihansoal}
              </h1>
              <div className="flex justify-center my-4">
                <div style={{ width: 100, height: 100 }}>
                  <CircularProgressbar
                    value={result.nilai_akhir}
                    text={`${result.nilai_akhir}%`}
                    styles={buildStyles({
                      textColor: "black",
                      pathColor: "#4caf50",
                      trailColor: "#E86262",
                    })}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-black font-bold flex items-center">
                  <Image
                    src="/centang.png"
                    width={16}
                    height={16}
                    alt="Benar"
                    className="mr-1"
                  />
                  <p>{result.jumlahBenar} Benar</p>
                </div>
                <div className="text-black font-bold flex items-center">
                  <Image
                    src="/silang.png"
                    width={16}
                    height={16}
                    alt="Salah"
                    className="mr-1"
                  />
                  <p>{result.jumlahSalah} Salah</p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center text-center mt-4">
                <div className="flex items-center">
                  <Image
                    src="/time.png"
                    width={16}
                    height={16}
                    alt="Durasi"
                    className="mr-1"
                  />
                  <p className="text-lg font-semibold text-black">
                    {result.durasi}
                  </p>
                </div>
                <h2 className="text-lg text-black mt-2">waktu pengerjaan</h2>
              </div>
            </div>
          </div>
          
        </div>
          <div className="container mx-auto mt-8">
            <CardDetailresult soalData={result.soalData} />
          </div>
      </div>
    </div>
  );
}
