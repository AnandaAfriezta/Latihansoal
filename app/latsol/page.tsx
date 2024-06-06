"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import CardLatsolAdmin from "../components/card/cardLatsolAdmin";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Image from "next/image";
import AddLatsol from "../Latsol/addLatsol";

type Props = {
  jumlah_soal: number;
  id_latihan_soal: number;
  nama_latihansoal: string;
  durasi: number;
  status: boolean;
  id_bank_soal: number;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getLatsol() {
  const res = await fetch(`${apiUrl}/latihansoal`, {
    method: "GET",
    cache: "no-store",
  });
  const data = await res.json();
  return data;
}

export default function LatihansoalList() {
  const [modal, setModal] = useState(false); // Define the modal state
  const [props, setProps] = useState<Props[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getLatsol();
      if (Array.isArray(data)) {
        setProps(data);
      } else {
        console.error("Expected an array but received:", data);
      }
    }
    fetchData();
  }, []);

  function handleChange() {
    console.log("Modal state changed");
    setModal(!modal);
  }

  async function handleAddLatsol(formData: any) {
    // Here, you would send the formData to your API to save the new latihan soal
    const res = await fetch(`${apiUrl}/latihansoal/add-latsol`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      // Fetch the updated list of latihan soal
      const updatedData = await getLatsol();
      if (Array.isArray(updatedData)) {
        setProps(updatedData);
      } else {
        console.error("Expected an array but received:", updatedData);
      }
      setModal(false);
    }
  }

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
          <AddLatsol onSubmit={handleAddLatsol}/>
          <div>
            {props.map((prop: Props, index: number) => (
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
