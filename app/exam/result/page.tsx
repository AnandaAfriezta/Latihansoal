import React from "react";
import Image from "next/image";

interface ResultProps {
  correctCount: number;
  wrongCount: number;
  nama_latihansoal: string;
  waktu_pengerjaan: string;
}

const Result: React.FC<ResultProps> = ({
  correctCount,
  wrongCount,
  nama_latihansoal,
  waktu_pengerjaan,
}) => {
  return (
    <div className="w-screen h-screen bg-slate-100">
      <div className="flex justify-center  bg-slate-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-1 text-black">
            Bahasa Inggris Simak UI
          </h1>
          {/* <div className='bg-gray-100 p-4 rounded-lg shadow-md'> */}
          <div className="circle">
            <h2 className="text-lg font-bold mb-2 text-black text-center">
              Nilai:
            </h2>
            <h2 className="text-3xl font-bold mb-2 text-green-500 text-center">
              100%
            </h2>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-black flex items-center">
              <Image
                src={"/centang.png"}
                width={16}
                height={16}
                alt={""}
                className="mr-1"
              />
              <p>Benar {correctCount}</p>
            </div>
            <div className="text-black flex items-center">
              <Image
                src={"/silang.png"}
                width={16}
                height={16}
                alt={""}
                className="mr-1"
              />
              <p>Salah {wrongCount}</p>
            </div>
          </div>
          <div className="flex items-center">
            {" "}
            {/* Menghapus flex-direction dan menambahkan items-center */}
            <div className="text-black flex mb-2 text-center items-center">
              <Image
                src={"/time.png"}
                width={16}
                height={16}
                alt={""}
                className="mr-1"
              />
              <p className="text-lg font-bold mb-2 text-black text-center">
                19:20
              </p>
              {/* <p className='text-black text-center mt-4'>Waktu Pengerjaan:</p> */}
            </div>
          </div>
          <h2 className="text-lg mb-2 text-black text-center">
            waktu pengerjaan:
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Result;
