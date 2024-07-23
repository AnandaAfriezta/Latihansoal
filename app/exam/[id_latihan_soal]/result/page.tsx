// examdetail.tsx
"use client"; // Add this line at the top

import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import CardDetailresult from "@/app/components/card/cardDetailresult";
import Cookies from "js-cookie";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Link from "next/link";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";
import { CardNilaiUser, handleDownload } from "@/app/components/card/cardDownloadResult";
import { toPng } from "html-to-image";

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
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const [audioSrc, setAudioSrc] = useState<string>("");
  const cardRef = useRef<HTMLDivElement | null>(null); // New ref for CardNilaiUser

  useEffect(() => {
    getResult(params.id_latihan_soal)
      .then((data) => {
        if (data && data.data) {
          setResult(data.data);
          if (data.data.nilai_akhir > 80) {
            setAudioSrc("/happysong.mp3");
          } else {
            setAudioSrc("/badsong.mp3");
          }

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
  }, [params.id_latihan_soal]);

  const handleShareToInstagramStory = async () => {
    if (resultRef.current === null) {
      return;
    }

    try {
      const dataUrl = await toPng(resultRef.current);
      if (dataUrl) {
        const link = document.createElement("a");
        link.href = `https://instagram.com/stories/create?backgroundImageUrl=${encodeURIComponent(dataUrl)}&stickerImageUrl=${encodeURIComponent(dataUrl)}&content_type=image/png`;
        link.target = "_blank";
        link.click();
      }
    } catch (error) {
      console.error("Failed to generate image for Instagram story", error);
    }
  };

  if (!result) {
    return <div>Loading...</div>;
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const title = `I'll show you my result scored ${result.nilai_akhir}% on ${result.nama_latihansoal}!`;

  return (
    <>
      <Head>
        <meta property="og:title" content={title} />
        <meta property="og:description" content="Check out my exam results!" />
        <meta property="og:image" content={imageUrl || "URL_TO_PREVIEW_IMAGE"} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="website" />
      </Head>

      <div className="w-full h-full bg-slate-100 p-8">
        <div className="w-full max-w-screen-md mx-auto px-4 bg-slate-100">
          <div className="grid w-full">
            <Link href="/">
              <ArrowBackIosNewIcon className="text-black cursor-pointer mb-5" />
            </Link>

            <div className="card bg-white p-8 rounded-xl max-w-screen-md shadow-lg">
              <h1 className="text-2xl font-semibold text-black text-center">
                {result.nama_latihansoal}
              </h1>
              <div className="flex justify-center my-4">
                <div style={{ width: 100, height: 100 }}>
                  <CircularProgressbar
                    value={currentScore}
                    text={`${currentScore}%`}
                    styles={buildStyles({
                      textColor: "black",
                      pathColor: "#4caf50",
                      trailColor: "#E86262",
                    })}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center my-4">
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
                <div className="flex items-center mb-2">
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
                <h2 className="text-lg text-black">Waktu Pengerjaan</h2>
              </div>
            </div>
            <div className="mt-4 p-4 border rounded-lg text-center">
              <h3 className="text-lg font-semibold mb-2">Share your result</h3>
              <p className="mb-4">{title}</p>
              <div className="flex justify-center mb-4">
                <FacebookShareButton url={shareUrl} quote={title} onClick={() => handleDownload(cardRef)} className="mr-4">
                  <FacebookIcon size={22} round />
                </FacebookShareButton>
                <WhatsappShareButton url={shareUrl} title={title} onClick={() => handleDownload(cardRef)} className="mr-4">
                  <WhatsappIcon size={22} round />
                </WhatsappShareButton>
                <TwitterShareButton url={shareUrl} title={title} onClick={() => handleDownload(cardRef)} className="mr-4">
                  <TwitterIcon size={22} round />
                </TwitterShareButton>
              </div>
              <button onClick={() => handleDownload(cardRef)} className="bg-[#31B057] text-white px-4 py-2 rounded">
                Download as PNG
              </button>
              <button onClick={handleShareToInstagramStory} className="bg-[#E1306C] text-white px-4 py-2 rounded mt-2">
                Share to Instagram Story
              </button>
            </div>
          </div>
        </div>  
        <div className="container mx-auto mt-8">
          <CardNilaiUser id_latihan_soal={params.id_latihan_soal} ref={cardRef} />
        </div>
        <div className="container mx-auto mt-8">
        <CardDetailresult soalData={result.soalData} />
        </div>
      </div>
      {audioSrc && <audio src={audioSrc} autoPlay />}
    </>
  );
}
