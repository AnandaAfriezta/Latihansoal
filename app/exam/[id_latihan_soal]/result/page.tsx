"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import CardDetailresult from "@/app/components/card/cardDetailresult";
import Cookies from "js-cookie";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Link from "next/link";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { toPng } from "html-to-image";

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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

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

  const handleDownloadImage = async () => {
    if (resultRef.current === null) {
      return;
    }

    try {
      const dataUrl = await toPng(resultRef.current);
      setImageUrl(dataUrl);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "result.png";
      link.click();
    } catch (error) {
      console.error("Failed to generate image", error);
    }
  };

  const handleShareToTwitter = () => {
    if (imageUrl) {
      const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(imageUrl)}&text=${encodeURIComponent("Check out my exam result!")}`;
      window.open(twitterShareUrl, "_blank");
    }
  };

  const handleShareToFacebook = () => {
    if (imageUrl) {
      const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}`;
      window.open(facebookShareUrl, "_blank");
    }
  };

  const handleShareToWhatsApp = () => {
    if (imageUrl) {
      const waShareUrl = `https://wa.me/?text=${encodeURIComponent("Check out my exam result! " + imageUrl)}`;
      window.open(waShareUrl, "_blank");
    }
  };

  const handleShareToInstagram = () => {
    if (imageUrl) {
      alert("Instagram tidak mendukung berbagi gambar langsung. Silakan unduh gambar terlebih dahulu, kemudian unggah secara manual ke Instagram.");
    }
  };

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

          <div ref={resultRef} className="flex justify-center bg-white p-8 rounded-xl shadow-md">
            <div className="bg-white p-8 rounded-xl max-w-screen-md">
              <h1 className="text-2xl font-semibold text-black text-center">
                {result.nama_latihansoal}
              </h1>
              <div className="flex justify-center my-4">
                <div style={{ width: 200, height: 200 }}>
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
          <button 
            onClick={handleDownloadImage}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
            Download Result
          </button>
          <div className="flex mt-4 space-x-2">
            <button 
              onClick={handleShareToTwitter}
              className="bg-blue-400 text-white py-2 px-4 rounded">
              Share to Twitter
            </button>
            <button 
              onClick={handleShareToFacebook}
              className="bg-blue-600 text-white py-2 px-4 rounded">
              Share to Facebook
            </button>
            <button 
              onClick={handleShareToWhatsApp}
              className="bg-green-500 text-white py-2 px-4 rounded">
              Share to WhatsApp
            </button>
            <button 
              onClick={handleShareToInstagram}
              className="bg-pink-500 text-white py-2 px-4 rounded">
              Share to Instagram
            </button>
          </div>
        </div>
        <div className="container mx-auto mt-8">
          <CardDetailresult soalData={result.soalData} />
        </div>
      </div>
    </div>
  );
}
