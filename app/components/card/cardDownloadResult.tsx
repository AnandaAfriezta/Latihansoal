import React, { useEffect, useState, forwardRef, Ref } from "react";
import { toPng } from "html-to-image";
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
    // Retrieve username from cookies
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

  return (
    <div
      ref={ref}
      style={{
        backgroundImage: "url('/bgdownloadresult.png')",
        backgroundSize: "cover",
        width: "430px",
        height: "932px",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          width: "377px",
          height: "528px",
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative"
        }}
      >
        {/* Title at the top */}
        <h2
          style={{
            fontFamily: "Nunito, sans-serif",
            color: "black",
            fontSize: "24px",
            marginBottom: "20px",
            marginTop: "0"
          }}
        >
          {result.nama_latihansoal}
        </h2>
        {/* Content centered vertically */}
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              fontFamily: "Nunito, sans-serif",
              color: "black",
              fontSize: "32px",
              fontWeight: "bold",
              marginBottom: "px"
            }}
          >
            {currentScore} %
          </div>
          <div
            style={{
              fontFamily: "Nunito, sans-serif",
              color: "black",
              fontSize: "18px",
            }}
          >
            {username}
          </div>
        </div>
      </div>
    </div>
  );
});

CardNilaiUser.displayName = "CardNilaiUser";

export { CardNilaiUser };
