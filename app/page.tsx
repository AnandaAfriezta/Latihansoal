"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import SearchLatsol from "./components/searchLatsol";
import CardLatsol from "./components/card/cardLatsol";
import AddLatsol from "./Latsol/addLatsol";
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

type Props = {
  data: Data[];
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function fetchLatihanSoal(token: string) {
  const res = await fetch(`${apiUrl}/latihansoal`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch Latihan Soal");
  }
  const data = await res.json();
  return data;
}

const Home: React.FC<Props> = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [latihanSoal, setLatihanSoal] = useState<Data[]>([]);
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async (token: string) => {
      try {
        const res = await fetch(`${apiUrl}/verify-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Token verification failed");
        }
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
        Cookies.remove("token");
        router.push("/login");
      }
    };

    const token = Cookies.get("token");
    if (token) {
      verifyToken(token);
    } else {
      router.push("/login");
    }

    const fetchData = async () => {
      try {
        if (token) {
          const data = await fetchLatihanSoal(token);
          setLatihanSoal(data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn, router]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin logout?");
    if (confirmLogout) {
      Cookies.remove("token");
      setIsLoggedIn(false);
      router.push("/login");
    }
  };

  const handleAddLatsol = async (formData: any) => {
    const token = Cookies.get("token");
    if (!token) return router.push("/login");

    try {
      const res = await fetch(`${apiUrl}/latihansoal/add-latsol`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newData = await fetchLatihanSoal(token);
        setLatihanSoal(newData);
        console.log("Latihan Soal berhasil ditambahkan!");
      } else {
        console.error("Gagal menambahkan Latihan Soal");
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
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
              placeholder="Ayo cari Latihan soal soalmu..."
              className="w-full rounded-full border bg-white border-gray-300 p-3 placeholder-[#BABEC6] mb-8 text-black"
            />
          </form>
          {latihanSoal.map((item: Data) => (
            <CardLatsol
              key={item.id_latihan_soal}
              id_latihan_soal={item.id_latihan_soal}
              nama_latihansoal={item.nama_latihansoal}
              durasi={item.durasi}
              jumlah_soal={item.jumlah_soal}
              tags={item.tags}
            />
          ))}
          <h1 className="text-slate-400 hover:underline cursor-pointer mt-4">
            <Link href="/Latsol">list latihan soal</Link>
          </h1>
        </div>
      </div>
    </main>
  );
};

export default Home;
