"use client";

import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Jawaban {
  id_jawaban: number;
  konten_jawaban: string;
  jawaban_benar: boolean; // Changed to boolean
}

interface Data {
  id_soal: number;
  konten_soal: string;
  pembahasan: string;
  jawaban: Jawaban[];
}

export default function EditSoal(props: Data) {
  const [konten_soal, setKontenSoal] = useState(props.konten_soal);
  const [jawaban, setJawaban] = useState(props.jawaban);
  const [pembahasan, setPembahasan] = useState(props.pembahasan);
  const [modal, setModal] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const router = useRouter();

  async function handleUpdate(e: SyntheticEvent) {
    e.preventDefault();

    setIsMutating(true);

    const updatedJawaban = jawaban.map(item => ({
      id_jawaban: item.id_jawaban,
      konten_jawaban: item.konten_jawaban,
      jawaban_benar: item.jawaban_benar,
    }));

    const requestBody = {
      soal: {
        konten_soal: konten_soal,
        jawaban: updatedJawaban,
        pembahasan: pembahasan,
      },
    };

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/soal/edit-soal/${props.id_soal}`,
      {
        method: "PATCH",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );
    setIsMutating(false);
    router.refresh();
    setModal(false);
  }

  function handleChange() {
    setModal(!modal);
  }

  return (
    <div>
      <div onClick={handleChange}>
        <Image src="/edit.png" alt="edit" width={16} height={16} />
      </div>
      <input
        type="checkbox"
        checked={modal}
        onChange={() => setModal(!modal)}
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box bg-slate-100">
          <h3 className="font-bold text-xl text-gray-800 mb-4">
            Edit 
          </h3>
          <form onSubmit={handleUpdate}>
            <div className="form-control">
              <label className="label font-semibold text-[#9CA3AF]">
                Konten Soal :{" "}
              </label>
              <textarea
                value={konten_soal}
                onChange={(e) => setKontenSoal(e.target.value)}
                className="textarea w-full input-bordered bg-slate-200 text-slate-800 mb-8"
                placeholder="Konten Soal"
              />
            </div>
            {jawaban.map((jawaban, index) => (
              <div key={index} className="form-control">
                <label className="label font-semibold text-[#9CA3AF]">
                  Jawaban {index + 1} :{" "}
                </label>
                <textarea
                  value={jawaban.konten_jawaban}
                  onChange={(e) =>
                    setJawaban((prevJawaban) =>
                      prevJawaban.map((item, idx) =>
                        idx === index
                          ? { ...item, konten_jawaban: e.target.value }
                          : item
                      )
                    )
                  }
                  className="textarea w-full input-bordered bg-slate-200 text-slate-800 mb-8"
                  placeholder={`Jawaban ${index + 1}`}
                />
              </div>
            ))}
            <div className="form-control">
              <label className="label font-semibold text-[#9CA3AF]">
                Pembahasan :{" "}
              </label>
              <textarea
                value={pembahasan}
                onChange={(e) => setPembahasan(e.target.value)}
                className="textarea w-full input-bordered bg-slate-200 text-slate-800 mb-8"
                placeholder="Pembahasan"
              />
            </div>
            <div className="w-full flex gap-2 justify-end">
              <button
                type="button"
                className="bg-[#E3D9CA] px-3 py-1 rounded-md text-black font-semibold text-md"
                style={{ boxShadow: "0 3px 0 0 #B1A6A6" }}
                onClick={handleChange}
              >
                batal
              </button>
              {!isMutating ? (
                <button
                  type="submit"
                  className="bg-[#31B057] px-3 py-1 rounded-md text-white font-semibold text-md"
                  style={{ boxShadow: "0 3px 0 0 #237D3E" }}
                >
                  update
                </button>
              ) : (
                <button type="button" className="btn loading">
                  updating...
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
