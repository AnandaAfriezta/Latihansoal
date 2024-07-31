// Import necessary libraries and components
"use client";
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

async function getResult(idEnrollment: number) {
  try {
    const res = await fetch(`${apiUrl}/ujian/${idEnrollment}/finish`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
    idEnrollment: number;
  };
}

interface Result {
  username: string;
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

// Function to format duration from seconds to minutes and seconds
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')} : ${String(remainingSeconds).padStart(2, '0')}`;
}

export default function ExamResult({ params }: ExamResultProps) {
  const [result, setResult] = useState<Result | null>(null);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const [audioSrc, setAudioSrc] = useState<string>("");
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [showCardNilaiUser, setShowCardNilaiUser] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    getResult(params.idEnrollment)
      .then((data) => {
        if (data && data.data) {
          setResult(data.data);
          if (data.data.nilai_akhir > 80) {
            setAudioSrc("/sounds/happyEffect.mp3");
          } else {
            setAudioSrc("/sounds/sadEffect.mp3");
          }

          const targetScore = data.data.nilai_akhir;
          if (targetScore === 0) {
            setCurrentScore(0);
          } else {
            let score = 0;
            const interval = setInterval(() => {
              score += 1;
              setCurrentScore(score);
              if (score >= targetScore) {
                clearInterval(interval);
              }
            }, 20);
          }
        } else {
          console.error("No data received or incorrect data structure");
        }
      })
      .catch((error) => console.error(error));
  }, [params.idEnrollment]);

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

  const handleDownloadCard = async () => {
    setShowCardNilaiUser(true);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await handleDownload(cardRef);
    setShowCardNilaiUser(false);
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  if (!result) {
    return <div>Loading...</div>;
  }

// Assuming these variables are populated from your data fetching logic
const latihanSoalName = result?.nama_latihansoal || "Latihan Soal";
const username = result?.username; // Replace this with the actual username
const score = result?.nilai_akhir || 0;

// Encode the parameters to safely include them in a URL
const encodedLatihanSoalName = encodeURIComponent(latihanSoalName);
const encodedUsername = encodeURIComponent(username);

// Construct the shareable URL with the additional query parameters
const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/result/${params.idEnrollment}`;

const title = `${username} mendapatkan score ${score} pada ${latihanSoalName}`;
const description = `Lihat hasil latihan soal saya di ${latihanSoalName}. Bagaimana dengan hasil Anda?`;

return (
  <>
    <Head>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
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
          <div className="card bg-white p-8 rounded-2xl max-w-screen-md shadow-lg">
            <h1 className="text-xl font-semibold text-black text-center">
              {latihanSoalName}
            </h1>
            <div className="flex justify-center my-4">
              <div style={{ width: 150, height: 150 }}>
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
            <div className="flex justify-center items-center text-black font-semibold gap-3">
              <div className="items-center justify-center">
                <div className="flex justify-center px-2 gap-2">
                  <p>{result.jumlahBenar}</p>
                  <Image
                    src="/centanghijau.svg"
                    width={16}
                    height={16}
                    alt="Benar"
                  />                   
                </div>
                <div className="flex items-center justify-center">
                  <p>Benar</p>                          
                </div>
              </div>
              <div className="items-center justify-center">
                <div className="flex justify-center px-2 gap-2">
                  <p>{result.jumlahSalah}</p>
                  <Image
                    src="/silangmerah.svg"
                    width={14}
                    height={14}
                    alt="Salah"
                  />                   
                </div>
                <div className="flex items-center justify-center">
                  <p>Salah</p>                          
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center my-4 text-black font-semibold">
              <div className="items-center justify-center">
                <div className="flex justify-center px-2 gap-2">
                  <Image
                    src="/timerhitam.svg"
                    width={16}
                    height={16}
                    alt="Benar"
                    />                   
                  <p>{formatDuration(result.durasi)}</p>
                </div>
                <div className="flex items-center justify-center">
                  <p>Waktu Pengerjaan</p>                          
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 border rounded-lg text-center">
            <h3 className="text-lg font-semibold mb-4">Bagikan hasilmu:</h3>
            <div className="flex justify-center">
              <FacebookShareButton url={shareUrl} quote={title} className="mr-4">
                <FacebookIcon size={22} round />
              </FacebookShareButton>
              <WhatsappShareButton url={shareUrl} title={title} separator=":: " className="mr-4">
                <WhatsappIcon size={22} round />
              </WhatsappShareButton>
              <TwitterShareButton url={shareUrl} title={title} className="mr-4">
                <TwitterIcon size={22} round />
              </TwitterShareButton>
            </div>
            <button onClick={handleDownloadCard} className="bg-[#31B057] text-white px-4 py-2 rounded">
              Download as PNG
            </button>
            <button onClick={handleShareToInstagramStory} className="bg-[#E1306C] text-white px-4 py-2 rounded mt-2">
              Share to Instagram Story
            </button>
          </div>
        </div>
      </div>
      <div className="w-full max-w-screen-md mx-auto px-4">
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
                  length: Math.ceil(result.soalData.length / itemsPerPage),
                }).map((_, rowIndex) => (
                  <div key={rowIndex} className="flex mb-1">
                    {Array.from({
                      length: Math.min(itemsPerPage, result.soalData.length - rowIndex * itemsPerPage),
                    }).map((_, colIndex) => {
                      const index = rowIndex * itemsPerPage + colIndex;
                      const isAnswered = result.soalData[index]?.jawaban.some(
                        (jawaban: any) => jawaban.jawaban_user === true
                      );
                      return (
                        <Link
                          key={index}
                          href={`#question-${index + 1}`}
                          onClick={toggleModal}
                        >
                          <div
                            className="block hover:bg-gray-200 focus:bg-gray-200 rounded-md m-2"
                            style={{
                              backgroundColor: isAnswered ? "#9E62CE" : "white",
                              color: isAnswered ? "white" : "black",
                              width: '40px',
                              height: '35px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {index + 1}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <CardDetailresult soalData={result.soalData} />
      </div>
      <div className="w-full max-w-screen-md mx-auto px-4">
        {showCardNilaiUser && <CardNilaiUser idEnrollment={params.idEnrollment} ref={cardRef} />}
      </div>
    </div>
    {audioSrc && <audio src={audioSrc} autoPlay />}
  </>
);


}