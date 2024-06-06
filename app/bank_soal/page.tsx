"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CardBankSoal from "../components/card/cardBankSoal";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Image from "next/image";
import AddBanksoal from "./addbanksoal";


type Props = {
  id_bank_soal: number;
  nama_banksoal: string;
  jumlah_soal: number;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getBankSoal() {
  const res = await fetch(`${apiUrl}/banksoal`, {
    method: "GET",
    cache: "no-store",
  });
  const data = await res.json();
  return data;
}

export default function BankSoalList() {
  const [bankSoalList, setBankSoalList] = useState<Props[]>([]);

  useEffect(() => {
    async function fetchBankSoal() {
      const data = await getBankSoal();
      setBankSoalList(data);
    }
    fetchBankSoal();
  }, []);

  const handleAddBanksoal = (newBanksoal: Props) => {
    setBankSoalList((prevList) => [...prevList, newBanksoal]);
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
            <AddBanksoal onSubmit={handleAddBanksoal} />
            {bankSoalList.map((prop, index) => (
              <CardBankSoal
                key={index}
                id_bank_soal={prop.id_bank_soal}
                nama_banksoal={prop.nama_banksoal}
                jumlah_soal={prop.jumlah_soal}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
