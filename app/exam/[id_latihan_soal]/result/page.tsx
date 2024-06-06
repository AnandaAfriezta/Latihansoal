"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import CardDetailresult from "@/app/components/card/cardDetailresult";
import Cookies from "js-cookie";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getResult(id_latihan_soal: number) {
  try {
    const userCookie = Cookies.get("user");
    if (!userCookie) {
      throw new Error("User data not found. Please login again.");
    }
    const userData = JSON.parse(userCookie);
    const token = userData.token;

    if (!token) {
      throw new Error("Token not found in user data.");
    }
    const res = await fetch(`${apiUrl}/ujian/${id_latihan_soal}/finish`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });
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
  nilai_akhir: number;
  benar: number;
  salah: number;
}

export default function ExamResult({ params }: ExamResultProps) {
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    getResult(params.id_latihan_soal)
      .then((data) => {
        setResult(data.data);
        console.log(data);
      })
      .catch((error) => console.error(error));
  }, [params.id_latihan_soal]);

  if (!result) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-screen h-screen bg-slate-100">
      <div></div>
      <div className="flex justify-center bg-slate-100">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-2xl font-semibold mb-3 text-black">
            {result.nama_latihansoal}
          </h1>
          <h2 className="text-lg font-bold text-#A8A3A3 text-center">Nilai:</h2>
          <h2 className="text-2xl font-bold text-black text-center">
            {result.nilai_akhir}%
          </h2>
          <div className="flex justify-between items-center">
            <div className="text-black font-bold flex items-center">
              <Image
                src={"/centang.png"}
                width={16}
                height={16}
                alt={""}
                className="mr-1"
              />
              <p>{result.benar} Benar</p>
            </div>
            <div className="text-black font-bold flex items-center">
              <Image
                src={"/silang.png"}
                width={16}
                height={16}
                alt={""}
                className="mr-1"
              />
              <p>{result.salah}Salah</p>
            </div>
          </div>
          <div className="flex items-center justify-center text-center">
            <Image
              src={"/time.png"}
              width={16}
              height={16}
              alt={""}
              className="mr-1"
            />
            <p className="text-lg font-semibold text-black">waktu</p>
          </div>
          <h2 className="text-lg text-black text-center">waktu pengerjaan</h2>
        </div>
      </div>
      <div className="mt-8">
        <CardDetailresult id={0} content={""} explain={""} jawaban={[]} />
      </div>
    </div>
  );
}
