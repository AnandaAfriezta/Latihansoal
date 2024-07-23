import React, { useEffect, useState, forwardRef, Ref } from "react";
import { toPng } from "html-to-image";
import Cookies from "js-cookie";
import Image from "next/image";

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

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60);
  return `${String(minutes).padStart(2, '0')} : ${String(remainingSeconds).padStart(2, '0')}`;
}

export const handleDownload = (ref: Ref<HTMLDivElement | null>) => {
  if (ref && typeof ref !== "function" && ref.current) {
    toPng(ref.current, { backgroundColor: 'white' })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "card.png";
        link.click();
      })
      .catch((error) => {
        console.error("Failed to convert to PNG", error);
      });
  } else {
    console.log("Reference to the component is not available");
  }
};

const CardNilaiUser = forwardRef<HTMLDivElement, CardNilaiUserProps>(({ id_latihan_soal }, ref) => {
  const [result, setResult] = useState<Result | null>(null);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const cookieUsername = Cookies.get("UserName") || "Unknown User";
    setUsername(cookieUsername);

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

  // Conditional class for circular card color
  const circularCardClass100 = currentScore > 75 ? "bg-[#7CD795]/25" : "bg-[#FFBFBF]/50";
  const circularCardClass50 = currentScore > 75 ? "bg-[#4ECB71]/50" : "bg-[#FF5F5F]/50";
  const circularCardClass25 = currentScore > 75 ? "bg-[#4ECB71]" : "bg-[#FF5F5F]";

  // Conditional text and styles based on score
  const message =
    currentScore > 75
      ? {
          title: "Hebat Sekali!",
          description: "Kamu mengerjakan Latihan Soal dengan sangat baik.",
          titleClass: "font-bold text-black",
          descriptionClass: "text-[#A8A3A3]",
        }
      : {
          title: "Sayang Sekali!",
          description: "Kamu belum berhasil kali ini, tetap semangat untuk mencoba lagi ya.",
          titleClass: "font-bold text-black",
          descriptionClass: "text-[#A8A3A3]",
        };

  return (
    <div
      ref={ref}
      className="bg-[url('/bgdownloadresult.png')] bg-cover w-[430px] h-[932px] flex flex-col justify-center items-center gap-4"
    >
      <div className="text-center">
        <div className="text-3xl text-[#FEFAEB] font-bold flex flex-col">
          <span>Ayo Lihat</span>
          <span>Pencapaianmu!</span>
        </div>
      </div>
      <div className="w-[377px] h-[528px] bg-white rounded-2xl p-3 shadow-lg flex flex-col items-center justify-center"
        style={{
          boxShadow: `
            0px 20px 29px 0px rgba(255, 255, 255, 0.1),
            0px 53px 53px 0px rgba(255, 255, 255, 0.09),
            0px 120px 72px 0px rgba(255, 255, 255, 0.05),
            0px 213px 85px 0px rgba(255, 255, 255, 0.05),
            0px 333px 93px 0px rgba(255, 255, 255, 0.05)
          `,
        }}   
      >
        <div className="flex flex-col items-center gap-4">
          <h2 className="font-nunito text-black text-center text-xl font-bold p-1">
            {result.nama_latihansoal}
          </h2>
          <div className="relative flex items-center p-1">
            <div className={`w-36 h-36 rounded-full ${circularCardClass100} flex items-center justify-center`}>
              <div className={`w-32 h-32 rounded-full ${circularCardClass50} flex items-center justify-center`}>
                <div className={`w-28 h-28 rounded-full ${circularCardClass25} flex items-center justify-center`}>
                  <div className="text-white text-4xl font-bold">
                    {currentScore}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col text-center p-1">
            <div className="w-max bg-[#F1EBFC] rounded-[20px]">
              <div className="font-nunito text-[#515151] text-center text-base  px-4 py-1">
                @{username}
              </div>
            </div>
          </div>

          <div className="flex flex-col text-center gap-2 p-2">
            <h3 className={`text-xl ${message.titleClass}`}>
              {message.title}
            </h3>
            <p className={`text-sm ${message.descriptionClass}`}>
              {message.description}
            </p>
          </div>

          <div className="flex flex-col text-center p-2">
            <div
              className="w-[304px] h-[74px] bg-[#9E78E4] rounded-lg flex items-center justify-around px-4 py-3 text-white text-sm"
              style={{ boxShadow: "0px 4px 0px 0px #8769BE" }}
            >
              <div className="flex justify-center items-center my-4 font-semibold">
                <div className="items-center justify-center">
                  <div className="flex justify-center px-2 gap-2">
                    <Image
                      src="/centangputih.svg"
                      width={14}
                      height={14}
                      alt="Benar"
                      />                   
                    <p>{result.jumlahBenar}</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <p>Soal Benar</p>                          
                  </div>
                </div>
              </div>
              <div className="w-px h-full bg-[#D0C1EC] mx-2"></div>
              <div className="flex justify-center items-center my-4 font-semibold">
                <div className="items-center justify-center">
                  <div className="flex justify-center px-2 gap-2">
                    <Image
                      src="/silangputih.svg"
                      width={14}
                      height={14}
                      alt="Salah"
                      />                   
                    <p>{result.jumlahSalah}</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <p>Soal Benar</p>                          
                  </div>
                </div>
              </div>
              <div className="w-px h-full bg-[#D0C1EC] mx-2"></div>
              <div className="flex justify-center items-center my-4 font-semibold">
                <div className="items-center justify-center">
                  <div className="flex justify-center px-2 gap-2">
                    <Image
                      src="/timerputih.svg"
                      width={14}
                      height={14}
                      alt="Durasi"
                      />                   
                    <p>{formatDuration(result.durasi)}</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <p>Lama Waktu</p>                          
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
});

CardNilaiUser.displayName = "CardNilaiUser";

export { CardNilaiUser };
