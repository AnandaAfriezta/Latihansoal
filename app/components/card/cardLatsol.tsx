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
    <div className="card bg-white my-4 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title text-gray-800 mr-8">
            {props.nama_latihansoal}
          </h2>
          <div className="flex items-center">
            {/* <EditButton id_latihan_soal={props.id_latihan_soal} />
            <DeleteButton id_latihan_soal={props.id_latihan_soal} /> */}
          </div>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="w-fit max-w-screen-md rounded-lg p-2 bg-[#F6EAEA]">
            <div className="flex justify-between items-center">
              <Image
                src={"/time.png"}
                width={16}
                height={16}
                alt={""}
                className="mr-1"
              />
              <p className="text-[#5A5A5A] font-regular text-xs mr-3">
                {props.durasi} Menit
              </p>
            </div>
          </div>
          <div className="w-fit max-w-screen-md rounded-lg p-2 bg-[#F6EAEA]">
            <div className="flex justify-between items-center">
              <Image
                src={"/komentar.png"}
                width={16}
                height={16}
                alt={""}
                className="mr-1"
              />
              <p className="text-[#5A5A5A] font-regular text-xs mr-3">
                {props.durasi} Soal
              </p>
            </div>
          </div>
          <CardButton id_latihan_soal={props.id_latihan_soal} />
        </div>
        <div className="flex gap-1">
          {props.tag &&
            props.tag.map((tag: any, index: number) => (
              <div key={index}>
                <p className="bg-slate-100 p-2 mb-2 rounded-lg w-fit text-xs">
                  {tag}
                </p>
                {index < props.tag.length - 1 && <div></div>}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}