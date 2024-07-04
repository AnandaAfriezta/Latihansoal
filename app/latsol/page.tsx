"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import CardLatsolAdmin from "../components/card/cardLatsolAdmin";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Image from "next/image";
import AddLatsol from "./addLatsol";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

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
    const token = Cookies.get("UserToken");
    const role = Cookies.get("UserRole")
    console.log("Current cookie:", token); // Added log
    if (!token) {
      throw new Error("User data not found. Please login again.");
    }

    if (!role || role !== "Kontributor") {
      throw new Error("Unauthorized")
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

    const responseData = await res.json();
    console.log("API response data:", responseData);
    return responseData.data; // Extract the data array
  } catch (error) {
    console.error("Failed to get latihansoal:", error);
    return [];
  }
}

export default function LatihanSoalList() {
  const [LatihanSoalList, setLatihanSoalList] = useState<Props[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("UserToken");
    if (token) {
      setIsLoggedIn(true);

      const fetchData = async () => {
        try {
          const data = await getLatihanSoal();
          if (Array.isArray(data)) {
            setLatihanSoalList(data);
          } else {
            console.error("Data is not an array:", data);
            setLatihanSoalList([]);
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
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin logout?");
    if (confirmLogout) {
      Cookies.remove("UserToken");
      setIsLoggedIn(false);
      router.push("/login");
    }
  };

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
              Latihan Soal
            </h1>
            <div className="w-8 h-8 relative rounded-full">
              {isLoggedIn ? (
                <Image
                  src="/avatar.png"
                  alt="Avatar"
                  layout="fill"
                  className="rounded-full cursor-pointer"
                  onClick={handleLogout}
                />
              ) : (
                <p
                  className="text-[#31B057] font-bold cursor-pointer hover:underline"
                  onClick={() => router.push("/login")}
                >
                  Login
                </p>
              )}
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
            <h1 className="text-slate-400 hover:underline cursor-pointer mt-4">
              <Link href="/bank_soal">list bank soal</Link>
            </h1>
            {LatihanSoalList.length > 0 ? (
              LatihanSoalList.map((prop: Props, index: number) => (
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
              ))
            ) : (
              <p>No data available</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
