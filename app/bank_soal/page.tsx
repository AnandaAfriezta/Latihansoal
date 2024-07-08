"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CardBankSoal from "../components/card/cardBankSoal";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Image from "next/image";
import AddBanksoal from "./addbanksoal";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

type Props = {
  id_bank_soal: number;
  nama_banksoal: string;
  jumlah_soal: number;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getBankSoal() {
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

    const res = await fetch(`${apiUrl}/banksoal`, {
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

export default function BankSoalList() {
  const [bankSoalList, setBankSoalList] = useState<Props[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("UserToken");
    if (token) {
      setIsLoggedIn(true);

      const fetchData = async () => {
        try {
          const data = await getBankSoal();
          if (Array.isArray(data)) {
            setBankSoalList(data);
          } else {
            console.error("Error setting Bank Soal data:", data);
            setBankSoalList([]);
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

  const handleAddBanksoal = async (newBanksoal: Props) => {
    setBankSoalList((prevList) => [newBanksoal, ...prevList]);
  };

  const filteredBankSoalList = bankSoalList.filter(
    (banksoal) =>
      banksoal.nama_banksoal &&
      banksoal.nama_banksoal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main>
      <div className="w-full bg-white py-8">
        <div className="w-full max-w-screen-md mx-auto px4">
          <div className="flex w-full items-center justify-between mt-3 mb-12">
            <Link href={"/"}>
              <ArrowBackIosNewIcon className="text-black" />
            </Link>
            <h1 className="font-bold text-black text-[20px] cursor-pointer hover:underline">
              Bank Soal
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <div>
            <AddBanksoal onSubmit={handleAddBanksoal} />
            <h1 className="text-slate-400 hover:underline cursor-pointer mt-4">
              <Link href="/Latsol">list latihan soal</Link>
            </h1>
            {filteredBankSoalList.length > 0 ? (
              filteredBankSoalList.map((prop, index) => (
                <CardBankSoal
                  key={index}
                  id_bank_soal={prop.id_bank_soal}
                  nama_banksoal={prop.nama_banksoal}
                  jumlah_soal={prop.jumlah_soal}
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