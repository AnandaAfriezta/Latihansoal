"use client";

import React, { useState, SyntheticEvent } from "react";
import { useRouter } from "next/navigation";

interface Jawaban {
  id_jawaban: number;
  konten_jawaban: string;
  jawaban_benar: string;
}

interface Data {
  id_soal: number;
  konten_soal: string;
  pembahasan: string;
  jawaban: Jawaban[];
}

interface Props {
  id_bank_soal: number;
  data: Data[];
}

const AddSoal: React.FC<Props> = ({ id_bank_soal, data }) => {
  const [konten_soal, setKontenSoal] = useState("");
  const [fileSoal, setFileSoal] = useState<File | null>(null);
  const [pembahasan, setPembahasan] = useState("");
  const [jawaban_benar, setJawaban_Benar] = useState<string | null>(null);
  const [jawabanList, setJawabanList] = useState([
    { konten_jawaban: "", jawaban_benar: "0" },
    { konten_jawaban: "", jawaban_benar: "0" },
    { konten_jawaban: "", jawaban_benar: "0" },
    { konten_jawaban: "", jawaban_benar: "0" },
  ]);
  const [modal, setModal] = useState(false);
  const [useTextForm, setUseTextForm] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const router = useRouter();

  const handleJawabanChange = (index: number, value: string) => {
    const newJawabanList = [...jawabanList];
    newJawabanList[index].konten_jawaban = value;
    setJawabanList(newJawabanList);
  };

  const indexToLetter = (index: number) => {
    return String.fromCharCode(65 + index);
  };

  const handleJawabanBenarChange = (index: number) => {
    const newJawabanList = jawabanList.map((jawaban, i) => ({
      ...jawaban,
      jawaban_benar: i === index ? "1" : "0",
    }));
    setJawabanList(newJawabanList);
    setJawaban_Benar(index.toString());
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const validCharacters = /^[a-zA-Z0-9\s.,;:?!\-\+\*\/\(\)\[\]\{\}\\=\|<>\^%$#@~`'"]*$/;

    if (!konten_soal.trim()) {
      newErrors.konten_soal = "Pertanyaan wajib diisi.";
    } else if (!validCharacters.test(konten_soal)) {
      newErrors.konten_soal = "Pertanyaan mengandung karakter tidak valid.";
    }

    if (!pembahasan.trim()) {
      newErrors.pembahasan = "Pembahasan wajib diisi.";
    } else if (!validCharacters.test(pembahasan)) {
      newErrors.pembahasan = "Pembahasan mengandung karakter tidak valid.";
    }

    const jawabanErrors = jawabanList.map((jawaban, index) => {
      if (!jawaban.konten_jawaban.trim()) {
        return `Jawaban opsi ${indexToLetter(index)} wajib diisi.`;
      } else if (!validCharacters.test(jawaban.konten_jawaban)) {
        return `Jawaban opsi ${indexToLetter(index)} mengandung karakter tidak valid.`;
      }
      return "";
    });

    jawabanErrors.forEach((error, index) => {
      if (error) {
        newErrors[`jawaban_${index}`] = error;
      }
    });

    if (jawaban_benar === null) {
      newErrors.jawaban_benar = "Silahkan pilih jawaban yang benar.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log("Mengirim formulir dengan data:", {
      konten_soal: konten_soal,
      jawaban: jawabanList,
      fileSoal: fileSoal,
      pembahasan: pembahasan,
    });

    const url = new URL(
      `https://latsol.ilhamirfan.my.id/soal/${id_bank_soal}/add-soal`
    );

    const params = new URLSearchParams();
    url.search = params.toString();

    const requestBody = {
      soal: {
        konten_soal: konten_soal,
        jawaban: jawabanList,
        fileSoal: fileSoal,
        pembahasan: pembahasan,
      },
    };

    await fetch(url.toString(), {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Formulir berhasil dikirim");

    resetForm();
    router.refresh();
    setModal(false);
  }

  const resetForm = () => {
    setKontenSoal("");
    setFileSoal(null);
    setPembahasan("");
    setJawaban_Benar(null);
    setJawabanList([
      { konten_jawaban: "", jawaban_benar: "0" },
      { konten_jawaban: "", jawaban_benar: "0" },
      { konten_jawaban: "", jawaban_benar: "0" },
      { konten_jawaban: "", jawaban_benar: "0" },
    ]);
    setErrors({});
  };

  function handleChange() {
    console.log("Modal state changed");
    setModal(!modal);
    if (modal) {
      resetForm();
    }
  }

  return (
    <div>
      <button
        className="text-white w-full bg-[#5CB85C] py-3 rounded-lg text-md font-semibold mb-8 flex justify-center items-center"
        style={{ boxShadow: "0 3px 0 0 #237D3E" }}
        onClick={handleChange}
      >
        <span className="text-md font-semibold mr-2">+</span> Tambah Soal
      </button>
      <input
        type="checkbox"
        checked={modal}
        onChange={handleChange}
        className="modal-toggle"
      />

      <div className="modal">
        <div className="modal-box bg-white">
          <h3 className="font-bold text-lg text-gray-800 my-5">Tambah Soal</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <textarea
                value={konten_soal}
                rows={5}
                onChange={(e) => setKontenSoal(e.target.value)}
                className={`bg-white rounded-lg border ${
                  errors.konten_soal ? "border-red-500" : "border-gray-300"
                } p-4 w-full my-3 focus:border-[#689ECF] focus:border-2 focus:ring-0 focus:outline-none`}
                placeholder="Tuliskan Soal . . ."
              />
              {errors.konten_soal && (
                <p className="text-red-500 text-sm">{errors.konten_soal}</p>
              )}
            </div>
            <div className="form-control my-3">
              {jawabanList.map((jawaban, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="relative w-full">
                    <input
                      type="radio"
                      name="jawaban_benar"
                      value={index.toString()}
                      checked={jawaban_benar === index.toString()}
                      onChange={() => handleJawabanBenarChange(index)}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 form-radio border-gray-300 rounded-md checked:bg-gray-400 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-[#689ECF]"
                    />
                    <input
                      type="text"
                      value={jawaban.konten_jawaban}
                      onChange={(e) => handleJawabanChange(index, e.target.value)}
                      className={`pl-8 input bg-white rounded-lg border ${
                        errors[`jawaban_${index}`]
                          ? "border-red-500"
                          : "border-gray-300"
                      } p-1 w-full text-black my-3 focus:border-[#689ECF] focus:border-2 focus:ring-0`}
                      placeholder={`Masukkan Jawaban Opsi ${indexToLetter(index)}`}
                    />
                    {errors[`jawaban_${index}`] && (
                      <p className="text-red-500 text-sm">
                        {errors[`jawaban_${index}`]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {errors.jawaban_benar && (
                <p className="text-red-500 text-sm">{errors.jawaban_benar}</p>
              )}
            </div>

            <div className="form-control">
              <textarea
                rows={5}
                value={pembahasan}
                onChange={(e) => setPembahasan(e.target.value)}
                className={`bg-white rounded-lg border ${
                  errors.pembahasan ? "border-red-500" : "border-gray-300"
                } p-4 w-full my-3 mb-5 focus:border-[#689ECF] focus:border-2 focus:ring-0 focus:outline-none`}
                placeholder="Tuliskan Jawaban dan Pembahasan Soal"
              />
              {errors.pembahasan && (
                <p className="text-red-500 text-sm">{errors.pembahasan}</p>
              )}
            </div>
            <div className="modal-action">
              <button
                className="bg-[#E3D9CA] px-3 py-1 rounded-md text-black"
                style={{ boxShadow: "0 3px 0 0 #B1A6A6" }}
                type="button"
                onClick={handleChange}
              >
                Batal
              </button>
              <button
                className="bg-[#5CB85C] px-3 py-1 rounded-md text-white"
                style={{ boxShadow: "0 3px 0 0 #237D3E" }}
                type="submit"
              >
                Tambah
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSoal;
