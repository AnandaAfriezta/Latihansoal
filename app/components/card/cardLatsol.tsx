import React from "react";
import Image from "next/image";
import CardButton from "../button/cardButton";
import Link from "next/link";
import EditButton from "../button/editButton";
import DeleteButton from "../button/deleteButtonLatsol";

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
      <h1 className="text-[18px] font-semibold text-black text-overflow mb-2 hover:underline">
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
          <CardButton id_latihan_soal={props.id_latihan_soal} />
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {props.tag &&
          props.tag.map((tag: any, index: number) => (
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
