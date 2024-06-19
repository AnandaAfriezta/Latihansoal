import React from "react";
import Image from "next/image";

interface Jawaban {
  id_jawaban: number;
  konten_jawaban: string;
  jawaban_benar: number;
  jawaban_user: boolean;
}

interface SoalData {
  id_soal: number;
  konten_soal: string;
  pembahasan: string;
  jawaban: Jawaban[];
}

type Props = {
  soalData: SoalData[];
};

export default function CardDetailresult({ soalData }: Props) {
  return (
    <div className="w-full mb-8">
      {soalData.map((soal) => (
        <div
          key={soal.id_soal}
          className="bg-white rounded-lg border border-gray-300 p-4 mb-8"
        >
          <div className="text-xl font-semibold text-black mb-4">
            {soal.konten_soal}
          </div>
          <div className="flex flex-col mb-4 w-full">
            {soal.jawaban.map((jawaban) => {
              const isUserAnswer = jawaban.jawaban_user;
              const isCorrectAnswer = jawaban.jawaban_benar === 1 && isUserAnswer;
              const isIncorrectAnswer = jawaban.jawaban_benar === 0 && isUserAnswer;

              return (
                <div
                  key={jawaban.id_jawaban}
                  className={`flex items-center justify-between ${
                    jawaban.jawaban_benar === 1 ? "bg-[#F2FFEC]" : ""
                    } ${
                      isCorrectAnswer ? "bg-[#F2FFEC]" : ""
                    } ${
                      isIncorrectAnswer ? "bg-[#FFEDED]" : ""
                    }  rounded-md p-2 mb-2`}
                  >
                  <div className="flex items-center">
                    { isUserAnswer ? (
                      <Image
                        src="/right answer.png"
                        width={16}
                        height={16}
                        alt="Right Answer"
                        className="mr-2"
                      />
                    ) : (
                      <Image
                        src="/wrong answer.png"
                        width={16}
                        height={16}
                        alt="Wrong Answer"
                        className="mr-2"
                      />
                    )}
                    <p className="font-medium text-black">
                      {jawaban.konten_jawaban}
                    </p>
                  </div>
                  {jawaban.jawaban_benar === 1 && (
                    <Image
                      src="/centang.png"
                      width={16}
                      height={16}
                      alt="Checklist"
                    />
                  )}
                  {isIncorrectAnswer && (
                    <Image
                    src="/silang.png"
                    width={16}
                    height={16}
                    alt="Cross"
                  />
                  )}
                </div>
              );
            })}
          </div>
          <div className="bg-[#FCFFD4] p-4 rounded-md">
            <p className="font-medium text-black text-md mb-2">Pembahasan:</p>
            <p className="font-medium text-black text-md">{soal.pembahasan}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
