"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CardLatsol from "./components/card/cardLatsol";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

type Tag = {
  id_tag: number;
  nama_tag: string;
};

type Data = {
  id_latihan_soal: number;
  nama_latihansoal: string;
  durasi: number;
  jumlah_soal: number;
  tags: Tag[];
};

type ApiResponse = {
  success: boolean;
  data: Data[];
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function fetchLatihanSoal(token: string) {
  const res = await fetch(`${apiUrl}/latihansoal`, {
    method: "GET",
    headers: {
      Authorization: `${token}`,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch Latihan Soal");
  }
  const data: ApiResponse = await res.json();
  if (!data.success) {
    throw new Error("Failed to fetch Latihan Soal");
  }
  return data.data;
}

const Home: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [latihanSoal, setLatihanSoal] = useState<Data[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("UserToken");
    
    if (token) {
      setIsLoggedIn(true);

      const fetchData = async () => {
        try {
          const data = await fetchLatihanSoal(token);
          setLatihanSoal(data);
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

  const filteredLatihanSoal = latihanSoal.filter((item) =>
    item.nama_latihansoal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main>
      <div className="w-full max-h-full bg-white py-8">
        <div className="w-full max-w-screen-md mx-auto px-4">
          <div className="flex w-full items-center justify-between mt-3 mb-12">
            <Link href={"/"}>
              {/* <ArrowBackIosNewIcon className="text-black" /> */}
            </Link>
            <h1 className="font-bold text-black text-[20px] cursor-pointer hover:underline">
              Latihan Soal
            </h1>
            <div className="w-8 h-8 relative rounded-full mr-4">
              {isLoggedIn ? (
                <Image
                  src="/avatar.png"
                  alt="Avatar"
                  layout="fill"
                  className="rounded-full cursor-pointer"
                  onClick={handleLogout}
                />
              ) : (
                <div className="flex items-center space-x-4">
                  <p
                    className="text-[#31B057] font-bold cursor-pointer hover:underline"
                    onClick={() => router.push("/login")}
                  >
                    Login
                  </p>
                </div>
              )}
            </div>
          </div>
          <form className="w-full">
            <input
              type="text"
              placeholder="Ayo cari Latihan soal soalmu..."
              className="w-full rounded-full border bg-white border-gray-300 p-3 placeholder-[#BABEC6] mb-8 text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          {filteredLatihanSoal.length > 0 ? (
            filteredLatihanSoal.map((item: Data) => (
              <CardLatsol
                key={item.id_latihan_soal}
                id_latihan_soal={item.id_latihan_soal}
                nama_latihansoal={item.nama_latihansoal}
                durasi={item.durasi}
                jumlah_soal={item.jumlah_soal}
                tags={item.tags}
              />
            ))
          ) : (
            <p>No data available</p>
          )}
          <h1 className="text-slate-400 hover:underline cursor-pointer mt-4">
            {/* <Link href="/Latsol">list latihan soal</Link> */}
          </h1>
        </div>
      </div>
    </main>
  );
};

export default Home;
