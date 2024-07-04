"use client";

import DeleteSoal from "@/app/bank_soal/detail_banksoal/[id_bank_soal]/deleteSoal";
import EditSoal from "@/app/bank_soal/detail_banksoal/[id_bank_soal]/editSoal";
import Image from "next/image";

interface Jawaban {
  id_jawaban: number;
  konten_jawaban: string;
  jawaban_benar: boolean; // Changed from string to boolean
}

interface Soal {
  id_soal: number;
  konten_soal: string;
  pembahasan: string;
  jawaban: Jawaban[];
}

export default function CardDetailBankSoal(props: Soal) {
  // Destructure props
  const { konten_soal, pembahasan, jawaban } = props;

  return (
    <div className="collapse collapse-arrow bg-white rounded-lg border border-gray-300 p-1 w-full mb-8">
      <input type="checkbox" name="my-accordion-1" />
      <div className="collapse-title text-xl font-semibold text-black text-overflow">
        {konten_soal}
      </div>
      <div className="w-full collapse-content">
        <div className="flex flex-col mb-4 w-full">
          {jawaban && Array.isArray(jawaban) && jawaban.length > 0 ? (
            jawaban.map((jawabanItem) => (
              <div
                key={jawabanItem.id_jawaban} // Use jawabanItem.id_jawaban
                className={`flex items-center justify-between ${
                  jawabanItem.jawaban_benar ? "bg-[#F2FFEC] " : ""
                }rounded-md p-2`}
              >
                <div className="flex items-center">
                  {jawabanItem.jawaban_benar ? (
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
                  {jawabanItem.konten_jawaban ? (
                    <p className="font-medium text-black">
                      {jawabanItem.konten_jawaban}
                    </p>
                  ) : (
                    <></>
                  )}
                </div>
                {jawabanItem.jawaban_benar ? (
                  <Image
                    src="/checklist.png"
                    width={16}
                    height={16}
                    alt="Checklist"
                  />
                ) : (
                  <></>
                )}
              </div>
            ))
          ) : (
            <p className="text-black">No answers available.</p>
          )}
        </div>
        <div className="bg-[#FCFFD4] p-4 rounded-lg">
          <p className="font-medium text-black text-md mb-2">Pembahasan:</p>
          <p className="font-medium text-black text-md">{pembahasan}</p>
        </div>
        <div className="flex gap-2">
          <EditSoal
            id_soal={props.id_soal}
            konten_soal={konten_soal}
            pembahasan={pembahasan}
            jawaban={jawaban}
          />
          <DeleteSoal id_soal={props.id_soal} />
        </div>
      </div>
    </div>
  );
}
