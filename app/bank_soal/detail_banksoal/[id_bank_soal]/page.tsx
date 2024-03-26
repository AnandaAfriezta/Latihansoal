import React from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Link from "next/link";
import CardDetailBankSoal from "@/app/components/card/cardDetailBankSoal";
import AddSoal from "./addSoal";

export const metadata = {
  title: "List Soal",
};

interface Jawaban {
  id_jawaban: number;
  konten_jawaban: string;
  jawaban_benar: string;
};

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

async function getDetailBankSoal(id_bank_soal: number) {
  const res = await fetch(
    `http://192.168.1.18:3000/soal/${id_bank_soal}/get-all-soal`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

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
      <div className="w-full bg-slate-100 py-8">
        <div className="w-full max-w-screen-md mx-auto px-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8 mt-3 mb-4">
              <Link href={"/bank_soal"}>
                <ArrowBackIosNewIcon className="text-primary" />
              </Link>
              <h1 className="font-bold text-primary text-4xl cursor-pointer hover:underline">
                List Soal
              </h1>
            </div>
            <AddSoal id_bank_soal={params.id_bank_soal} data={params.data}/>
          </div>
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
