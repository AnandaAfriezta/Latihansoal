"use client";

import { useState, useEffect } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Link from "next/link";
import CardDetailBankSoal from "@/app/components/card/cardDetailBankSoal";
import AddSoal from "./addSoal";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface Jawaban {
  id_jawaban: number;
  konten_jawaban: string;
  jawaban_benar: string;
}

interface Soal {
  id_soal: number;
  konten_soal: string;
  pembahasan: string;
  jawaban: Jawaban[];
}

interface Data {
  soal: Soal[];
}

interface DetailBankSoalProps {
  params: {
    id_bank_soal: number;
  };
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getDetailBankSoal(id_bank_soal: number) {
  try {
    const role = Cookies.get("UserRole");
    const token = Cookies.get("UserToken");
    console.log("Current cookie:", token); // Added log
    if (!token) {
      throw new Error("User data not found. Please login again.");
    }

    if (!role || role !== "Kontributor") {
      throw new Error("Unauthorized");
    }

    console.log("API", `${apiUrl}/soal/${id_bank_soal}/get-all-soal`)

    const res = await fetch(`${apiUrl}/soal/${id_bank_soal}/get-all-soal`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Unauthorized. Please login again.");
      } else {
        throw new Error(`Failed to fetch data: ${res.statusText}`);
      }
    }

    const responseData = await res.json();
    console.log("API response data:", responseData);
    return responseData.data;
  } catch (error) {
    console.error("Failed to get bank soal:", error);
    return [];
  }
}

export default function DetailBankSoalList({ params }: DetailBankSoalProps) {
  const [SoalList, setSoalList] = useState<Soal[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("UserToken");
    if (token) {
      setIsLoggedIn(true);

      const fetchData = async () => {
        try {
          const data = await getDetailBankSoal(params.id_bank_soal);
          console.log("Fetched data:", data);
          if (Array.isArray(data)) {
            setSoalList(data);
          } else {
            console.error("Error setting Soal data:", data);
            setSoalList([]);
          }
          console.log(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    } else {
      setIsLoggedIn(false);
    }
  }, [params.id_bank_soal]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin logout?");
    if (confirmLogout) {
      Cookies.remove("UserToken");
      setIsLoggedIn(false);
      router.push("/login");
    }
  };

  const handleAddSoal = async (newSoal: Soal) => {
    setSoalList((prevList) => [...prevList, newSoal]);
  };

  return (
    <main>
      <div className="w-full bg-white py-8">
        <div className="w-full max-w-screen-md mx-auto px-4">
          <div className="flex w-full items-center justify-between mt-3 mb-12">
            <Link href={"/bank_soal"}>
              <ArrowBackIosNewIcon className="text-black" />
            </Link>
            <h1 className="font-bold text-black text-[20px] cursor-pointer hover:underline">
              List Soal
            </h1>
            <div className="w-8 h-8 relative rounded-full">
              <Image
                src="/avatar.png"
                alt="Avatar"
                layout="fill"
                className="rounded-full"
              />
            </div>
          </div>

          <AddSoal id_bank_soal={params.id_bank_soal} data={SoalList} />
          {SoalList.length > 0 ? (
            SoalList.map((prop, index) => (
              <CardDetailBankSoal
              key={index}
              id_soal={prop.id_soal}
              konten_soal={prop.konten_soal}
              jawaban={prop.jawaban}
              pembahasan={prop.pembahasan}
              />
            ))
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>
    </main>
  );
}
