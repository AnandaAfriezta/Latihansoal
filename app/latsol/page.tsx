"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import CardLatsolAdmin from "../components/card/cardLatsolAdmin";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Image from "next/image";
import AddLatsol from "./addLatsol";
import Cookies from "js-cookie";

type Props = {
  id_latihan_soal: number;
  nama_latihansoal: string;
  durasi: number;
  status: string;
  id_bank_soal: number;
  jumlah_soal: number;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getLatihanSoal() {
  try {
    const userCookie = Cookies.get("Kontributor");
    console.log("Current cookie:", userCookie); // Tambahkan log ini

    if (!userCookie) {
      throw new Error("User data not found. Please login again.");
    }

    const userData = JSON.parse(userCookie);
    const token = userData.token;

    if (!token) {
      throw new Error("Token not found in user data.");
    }

    const res = await fetch(`${apiUrl}/latihansoal`, {
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

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to get latihansoal:", error);
    // Handle error state or redirect to login page if necessary
  }
}


export default function LatihanSoalList() {
  const [latihanSoalList, setLatihanSoalList] = useState<Props[]>([]);

  useEffect(() => {
    async function fetchLatihanSoal() {
      const data = await getLatihanSoal();
      setLatihanSoalList(data);
    }
    fetchLatihanSoal();
  }, []);

  const handleAddLatihansoal = (newLatihanSoal: Props) => {
    setLatihanSoalList((prevList) => [...prevList, newLatihanSoal]);
  };

  return (
    <main>
      <div className="w-full bg-white py-8">
        <div className="w-full max-w-screen-md mx-auto px-4">
          <div className="flex w-full items-center justify-between mt-3 mb-12">
            <Link href={"/"}>
              <ArrowBackIosNewIcon className="text-black" />
            </Link>
            <h1 className="font-bold text-black text-[20px] cursor-pointer hover:underline">
              Bank Soal
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
          <form className="w-full">
            <input
              type="text"
              placeholder="Ayo cari bank soalmu..."
              className="w-full rounded-full border bg-white border-gray-300 p-3 placeholder-[#BABEC6] mb-8 text-black"
            />
          </form>
          <div>
          <AddLatsol onSubmit={handleAddLatihansoal} />
            {latihanSoalList.map((prop: Props, index: number) => (
              <CardLatsolAdmin
                key={index}
                id_latihan_soal={prop.id_latihan_soal}
                id_bank_soal={prop.id_bank_soal}
                nama_latihansoal={prop.nama_latihansoal}
                jumlah_soal={prop.jumlah_soal}
                durasi={prop.durasi}
                status={prop.status}
                tag={[]}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
