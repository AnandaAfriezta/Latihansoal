"use client";

import React, { useEffect, useState, useRef, forwardRef } from "react";
import Image from "next/image";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Cookies from "js-cookie";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getResult(id_latihan_soal: number) {
  try {
    const token = Cookies.get("UserToken");
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

interface Result {
  nama_latihansoal: string;
  durasi: number;
  nilai_akhir: number;
  jumlahBenar: number;
  jumlahSalah: number;
  username: string;
}

interface CardNilaiUserProps {
  id_latihan_soal: number;
}

// Use forwardRef to pass the ref to the div
const CardNilaiUser = forwardRef<HTMLDivElement, CardNilaiUserProps>(({ id_latihan_soal }, ref) => {
  const [result, setResult] = useState<Result | null>(null);
  const [currentScore, setCurrentScore] = useState<number>(0);

  useEffect(() => {
    getResult(id_latihan_soal)
      .then((data) => {
        if (data && data.data) {
          setResult(data.data);

          let score = 0;
          const interval = setInterval(() => {
            score += 1;
            setCurrentScore(score);
            if (score >= data.data.nilai_akhir) {
              clearInterval(interval);
            }
          }, 20);
        } else {
          console.error("No data received or incorrect data structure");
        }
      })
      .catch((error) => console.error(error));
  }, [id_latihan_soal]);

  if (!result) {
    return <div>Loading...</div>;
  }

  return (
    <div ref={ref}></div>
  );
});

CardNilaiUser.displayName = "CardNilaiUser";

export default CardNilaiUser;
