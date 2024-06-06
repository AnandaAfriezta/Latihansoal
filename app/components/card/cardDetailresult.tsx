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

export default function CardDetailresult(props: Props) {
  return (
    <div className="bg-white rounded-lg border border-gray-300 p-1 w-full mb-8">
      <div className="text-xl font-semibold text-black text-overflow">
        {props.content}
      </div>
      <div className="w-full">
        <div className="flex flex-col mb-4 w-full">
          {props.jawaban.map((jawaban) => (
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
                <p className="font-medium text-black">
                  {jawaban.konten_jawaban}
                </p>
              </div>
              {jawaban.jawaban_benar && (
                <Image
                  src="/checklist.png"
                  width={16}
                  height={16}
                  alt="Checklist"
                />
              )}
              {jawaban.konten_jawaban === "" && (
                <p className="text-red-500 font-medium"></p>
              )}
            </div>
          ))}
        </div>
        <div className="bg-[#FCFFD4] p-4 radius-md">
          <p className="font-medium text-black text-md mb-2">Pembahasan:</p>
          <p className="font-medium text-black text-md">{props.explain}</p>
        </div>
      </div>
    </div>
  );
}
