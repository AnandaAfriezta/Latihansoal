import React from "react";
import Image from "next/image";
// import EditLatsol from "@/app/components/button/editlatsoll";
// import DeleteLatsol from "@/app/components/button/deletelatsol";
import Link from "next/link";

type Tag = {
  id_tags: number;
  nama_tags: string;
};

type Data = {
  id_latihan_soal: number;
  nama_latihansoal: string;
  durasi: number;
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
            {props.durasi} Soal
          </p>
        </div>
        <div className="ml-auto flex gap-2">
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {props.tag &&
          props.tag.map((tag: Tag, index: number) => (
            <div key={index}>
              <p className="bg-slate-100 p-2 mb-2 rounded-lg w-fit text-xs">
                {tag.nama_tags}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
