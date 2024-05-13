import React from "react";
import EditBankButton from "../button/editBankButton";
import EditBankSoal from "@/app/bank_soal/editBankSoal";
import DeleteBankSoal from "@/app/bank_soal/deleteBankSoal";
import DetailBankButton from "../button/detailBankButton";
import Link from "next/link";

type Props = {
  id_bank_soal: number;
  nama_banksoal: string;
  jumlah_soal: number;
  waktu: number;
};

export default function CardBankSoal(props: Props) {
  return (
    <div className="max-w-screen-md bg-white rounded-lg border border-gray-300 p-4 flex justify-between w-full mb-8">
      <div>
        <Link href={`bank_soal/detail_banksoal/${props.id_bank_soal}`}>
          <h1 className="text-[16px] font-bold text-black text-overflow mb-2 hover:underline">
            {props.nama_banksoal}
          </h1>
        </Link>
        <div className="bg-gray-300 rounded-full inline-block py-1 px-2">
          <h1 className="text-black font-medium text-[10px]">
            {props.jumlah_soal} soal
          </h1>
        </div>
      </div>
      <div className="flex gap-2">
        <EditBankSoal {...props} />
        <DeleteBankSoal {...props} />
      </div>
    </div>
  );
}
