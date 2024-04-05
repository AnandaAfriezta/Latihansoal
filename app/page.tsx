'use client';

import React from "react";
import Link from "next/link";
import SearchLatsol from "./components/searchLatsol";
import CardLatsol from "./components/card/cardLatsol";
import AddLatsol from "./components/modal/addLatsol";

type Tag = {
  id_tag: number;
  nama_tag: string;
};

type Data = {
  id_latihan_soal: number;
  nama_latihansoal: string;
  durasi: number;
  tags: Tag[];
};

type Props = {
  id_latihan_soal: number;
  data: Data[];
};
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function fetchLatihanSoal() {
  const res = await fetch(`${apiUrl}/latihansoal`, {
    method: "GET",
    cache: "no-store",
  });
  const data = await res.json();
  return data;
}

const Home: React.FC<Props> = ({ data }) => {
  const [latihanSoal, setLatihanSoal] = React.useState<Data[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await fetchLatihanSoal();
      setLatihanSoal(data);
    };

    fetchData();
  }, []);

  const handleAddLatsol = async (formData: any) => {
    try {
      const res = await fetch(`${apiUrl}/latihansoal/add-latsol`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newData = await fetchLatihanSoal();
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
      <div className="w-full bg-slate-100 py-8">
        <div className="w-full max-w-screen-md mx-auto px-4">
          <div className="flex justify-between items-center ">
            <h1 className="font-bold text-primary text-4xl mb-4 cursor-pointer hover:underline">
              Latihan Soal
            </h1>
          </div>
          <div className="w-full mb-8">
            <SearchLatsol />
          </div>
          {latihanSoal.map((item: Data, index: number) => (
            <CardLatsol
              key={index}
              id_latihan_soal={item.id_latihan_soal}
              nama_latihansoal={item.nama_latihansoal}
              durasi={item.durasi}
              tag={item.tags}
            />
          ))}
          <h1 className="text-slate-400 hover:underline cursor-pointer mt-4">
            <Link href="/bank_soal">list bank soal</Link>
          </h1>
        </div>
      </div>
    </main>
  );
};

export default Home;
