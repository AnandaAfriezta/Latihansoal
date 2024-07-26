import React from "react";
import Image from "next/image";
import EditLatsol from "@/app/components/button/editlatsol";
import DeleteLatsol from "@/app/components/button/deletelatsol";
import Link from "next/link";

type Tag = {
  id_tags: number;
  nama_tags: string;
  durasi: number;
};

type Data = {
  id_latihan_soal: number;
  id_bank_soal: number;
  nama_latihansoal: string;
  durasi: number;
  status: string;
  jumlah_soal: number;
  tag: Tag[];
};

export default function CardLatsol(props: Data) {
  return (
    <div className="max-w-screen-md bg-white rounded-lg border border-gray-300 p-4 flex flex-col w-full mb-8">
      <h1 className="text-[20px] font-semibold text-black text-overflow mb-2 hover:underline">
        {props.nama_latihansoal}
      </h1>
      <div className="flex items-center mb-4">
        <div className="flex gap-4">
          <div className="flex justify-between items-center">
            <Image
              src={"/time.png"}
              width={16}
              height={16}
              alt={""}
              className="mr-1"
            />
            <p className="text-[#A8A3A3] font-regular text-lg mr-3">
              {props.durasi} Menit
            </p>
          </div>
          <p className="text-[#A8A3A3] font-regular text-lg mr-3">
            {props.jumlah_soal} Soal
          </p>
          <p className="text-[#A8A3A3] font-regular text-lg mr-3">
            {props.status}
          </p>
          {props.tag.map((tag: Tag, index: number) => (
            <p
              key={index}
              className="text-[#A8A3A3] font-regular text-lg mr-3"
            >
              {tag.nama_tags}
            </p>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          <EditLatsol {...props} />
          <DeleteLatsol {...props} />
        </div>
      </div>
    </div>
  );
}
