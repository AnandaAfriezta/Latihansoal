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
    <div className='w-screen h-screen bg-slate-100'>
      <div className='flex justify-center bg-slate-100'>
        <div className='bg-white p-8 rounded-xl shadow-md'>
          <h1 className='text-2xl font-semibold mb-3 text-black'>Bahasa Inggris Simak UI</h1>
          <div className='circle'>
            <h2 className='text-lg font-bold  text-#A8A3A3 text-center'>Nilai:</h2>
            <h2 className='text-2xl font-bold  text-black text-center'>100%</h2>
          </div>
          <div className="flex justify-between items-center">
            <div className='text-black font-bold flex items-center'>
            <Image
                src={"/centang.png"}
                width={16}
                height={16}
                alt={""}
                className="mr-1"
              />
              <p>8 {correctCount}</p>
            </div>
            <div className='text-black font-bold  flex items-center'>
            <Image
                src={"/silang.png"}
                width={16}
                height={16}
                alt={""}
                className="mr-1"
              />
              <p>2 {wrongCount}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className='text-black flex  items-center'>
              <p>Benar {correctCount}</p>
            </div>
            <div className='text-black flex items-center'>
              <p>Salah{wrongCount}</p>
            </div>
          </div>
          <div className="flex items-center justify-center  text-center"> 
            <Image
              src={"/time.png"}
              width={16}
              height={16}
              alt={""}
              className="mr-1"
            />
            <p className='text-lg font-semibold  text-black'>19:20</p>
          </div>
          <h2 className='text-lg  text-black text-center'>waktu pengerjaan</h2>
        </div>
      </div>
    </div>
  );
};

export default Result;
