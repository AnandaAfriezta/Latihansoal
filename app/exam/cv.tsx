"use server";

import DetailQuestions from "@/app/components/detailQuestions";

async function getSoal(id_latihan_soal: number) {
  const res = await fetch(
    `http://10.28.1.92:3000/ujian/${id_latihan_soal}/get-all-soal`,
    {
      method: "GET",
      cache: "no-store",
    },
  );
  const data = await res.json();
  return data;
}

interface detailUjianProps {
  params: {
    id_latihan_soal: number;
  };
}

export default async function ExamDetail({ params }: detailUjianProps) {
  const data = await getSoal(params.id_latihan_soal);

  return (
    <div className="w-full bg-slate-100 py-8">
      <div className="w-full max-w-screen-md mx-auto px-4">
        <p>{params.id_latihan_soal}</p>

        <div className="flex flex-col gap-4 items-center">
          {data.data.soalData.map((item: any, index: number) => {
            return (
              <DetailQuestions
                key={index}
                id_soal={item.id_soal}
                konten_soal={item.konten_soal}
                jawaban={item.jawaban}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
