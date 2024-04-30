import React from "react";
import Image from "next/image";

interface ResultObject {
  id_latihan_soal: number;
  nama_latihansoal: string;
  nilai_akhir: number;
}

const DetailResult: React.FC<ResultObject> = ({
  id_latihan_soal,
  nama_latihansoal,
  nilai_akhir,
}) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-2xl font-semibold mb-3 text-black">
        {nama_latihansoal}
      </h1>
      <h2 className="text-lg font-bold text-gray-500 text-center">Nilai:</h2>
      <h2 className="text-2xl font-bold text-black text-center">
        {nilai_akhir}%
      </h2>
      <div className="flex justify-between items-center">
        <div className="text-black font-bold flex items-center">
          <Image
            src={"/centang.png"}
            width={16}
            height={16}
            alt={"Centang"}
            className="mr-1"
          />
          <p>0 Benar</p>
        </div>
        <div className="text-black font-bold flex items-center">
          <Image
            src={"/silang.png"}
            width={16}
            height={16}
            alt={"Silang"}
            className="mr-1"
          />
          <p>0 Salah</p>
        </div>
      </div>
      <div className="flex items-center justify-center text-center">
        <Image
          src={"/time.png"}
          width={16}
          height={16}
          alt={"Waktu"}
          className="mr-1"
        />
        <p className="text-lg font-semibold text-black">waktu</p>
      </div>
      <h2 className="text-lg text-black text-center">waktu pengerjaan</h2>
    </div>
  );
};

export default DetailResult;
