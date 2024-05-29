import React from "react";
import Image from "next/image";
import CardButton from "../button/cardButton";
import Link from "next/link";

type Tag = {
  id_tag: number;
  nama_tag: string;
};

type Props = {
  id_latihan_soal: number;
  nama_latihansoal: string;
  durasi: number;
  jumlah_soal: number;
  tags: Tag[];
};

export default function CardLatsol(props: Props) {
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
        </div>
        <div className="ml-auto flex gap-2">
          <CardButton id_latihan_soal={props.id_latihan_soal} />
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {props.tags &&
          props.tags.map((tag: any, index: number) => (
            <div key={index}>
              <p className="bg-slate-100 p-2 mb-2 rounded-lg w-fit text-xs">
                {tag.nama_tag}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
