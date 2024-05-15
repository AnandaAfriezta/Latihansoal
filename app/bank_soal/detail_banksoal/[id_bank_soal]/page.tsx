import React from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Link from "next/link";
import CardDetailBankSoal from "@/app/components/card/cardDetailBankSoal";
import AddSoal from "./addSoal";
import Image from "next/image";

export const metadata = {
  title: "List Soal",
};

interface Jawaban {
  id_jawaban: number;
  konten_jawaban: string;
  jawaban_benar: string;
}

type Data = {
  id_soal: number;
  konten_soal: string;
  pembahasan: string;
  jawaban: Jawaban[];
};
type Props = {
  id_bank_soal: number;
  data: Data[];
};
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getDetailBankSoal(id_bank_soal: number) {
  const res = await fetch(`${apiUrl}/soal/${id_bank_soal}/get-all-soal`, {
    method: "GET",
    cache: "no-store",
  });

  const data = await res.json();
  return data;
}

interface DetailBankProps {
  params: {
    id_bank_soal: number;
    data: Data[];
  };
}

export default async function DetailBankSoal({ params }: DetailBankProps) {
  const props: Props = await getDetailBankSoal(params.id_bank_soal);
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

          <AddSoal id_bank_soal={params.id_bank_soal} data={params.data} />
          {props.data.map((prop: any, index: number) => (
            <CardDetailBankSoal
              key={index}
              id={prop.id_soal}
              content={prop.konten_soal}
              explain={prop.pembahasan}
              jawaban={prop.jawaban}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
