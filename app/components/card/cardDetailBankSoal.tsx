import DeleteSoal from "@/app/bank_soal/detail_banksoal/[id_bank_soal]/deleteSoal";
import EditSoal from "@/app/bank_soal/detail_banksoal/[id_bank_soal]/editSoal";
import Image from "next/image";

type Jawaban = {
  id_jawaban: number;
  konten_jawaban: string;
  jawaban_benar: boolean;
};

type Props = {
  id: number;
  content: string;
  explain: string;
  jawaban: Jawaban[];
};

export default function CardDetailBankSoal(props: Props) {
  const { id, content, explain, jawaban } = props;

  return (
    <div className="collapse collapse-arrow bg-white rounded-lg border border-gray-300 p-1 w-full mb-8">
      <input type="checkbox" name="my-accordion-1" />
      <div className="collapse-title text-xl font-semibold text-black text-overflow">
        {content}
      </div>
      <div className="w-full collapse-content">
        <div className="flex flex-col mb-4 w-full">
          {jawaban.map((jawaban) => (
            <div
              key={jawaban.id_jawaban}
              className={`flex items-center justify-between ${
                jawaban.jawaban_benar ? "bg-[#F2FFEC] " : ""
              }rounded-md p-2`}
            >
              <div className="flex items-center">
                {jawaban.jawaban_benar ? (
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
                {jawaban.konten_jawaban && (
                  <p className="font-medium text-black">
                    {jawaban.konten_jawaban}
                  </p>
                )}
              </div>
              {jawaban.jawaban_benar && (
                <Image
                  src="/checklist.png"
                  width={16}
                  height={16}
                  alt="Checklist"
                />
              )}
            </div>
          ))}
        </div>
        <div className="bg-[#FCFFD4] p-4 rounded-lg">
          <p className="font-medium text-black text-md mb-2">Pembahasan:</p>
          <p className="font-medium text-black text-md">{explain}</p>
        </div>
        <div className="flex gap-2">
          <EditSoal
            id_soal={id}
            konten_soal={content}
            pembahasan={explain}
            jawaban={jawaban}
          />
          <DeleteSoal
            id_soal={id}
          />
        </div>
      </div>
    </div>
  );
}
