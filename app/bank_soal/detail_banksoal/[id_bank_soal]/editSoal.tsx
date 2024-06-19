"use client";

import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Cookies from "js-cookie";

interface Jawaban {
  id_jawaban: number;
  konten_jawaban: string;
  jawaban_benar: boolean;
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

  const [initialKontenSoal] = useState(props.konten_soal);
  const [initialJawaban] = useState(props.jawaban);
  const [initialPembahasan] = useState(props.pembahasan);

  const [modal, setModal] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const indexToLetter = (index: number) => {
    return String.fromCharCode(65 + index);
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

    const jawabanErrors = jawaban.map((jawaban, index) => {
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

    const isAnyJawabanBenar = jawaban.some((j) => j.jawaban_benar);
    if (!isAnyJawabanBenar) {
      newErrors.jawaban_benar = "Silahkan pilih jawaban yang benar.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  async function handleUpdate(e: SyntheticEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsMutating(true);

    try {
      const userCookie = Cookies.get("Kontributor");
      if (!userCookie) {
        throw new Error("User data not found. Please login again.");
      }

      const userData = JSON.parse(userCookie);
      const token = userData.token;

      if (!token) {
        throw new Error("Token not found in user data.");
      }

      const updatedJawaban = jawaban.map((item) => ({
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

      await fetch(`${apiUrl}/soal/edit-soal/${props.id_soal}`, {
        method: "PATCH",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      setIsMutating(false);
      router.refresh();
      setModal(false);
    } catch (error) {
      console.error(error);
      // Handle error, e.g., show error message to user
      setIsMutating(false);
    }
  }

  function handleChange() {
    setModal(!modal);
    if (!modal) {
      setKontenSoal(initialKontenSoal);
      setJawaban(initialJawaban);
      setPembahasan(initialPembahasan);
      setErrors({});
    }
  }

  function handleJawabanChange(index: number, key: string, value: any) {
    setJawaban((prevJawaban) =>
      prevJawaban.map((item, idx) =>
        idx === index ? { ...item, [key]: value } : item
      )
    );
  }

  function handleRadioChange(index: number) {
    setJawaban((prevJawaban) =>
      prevJawaban.map((item, idx) => ({
        ...item,
        jawaban_benar: idx === index,
      }))
    );
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
        <div className="modal-box bg-white">
          <h3 className="font-bold text-lg text-gray-800 my-5">Edit Soal</h3>
          <form onSubmit={handleUpdate}>
            <div className="form-control my-3">
              <textarea
                rows={5}
                value={konten_soal}
                onChange={(e) => setKontenSoal(e.target.value)}
                className={`bg-white rounded-lg border p-4 w-full focus:border-[#689ECF] focus:border-2 focus:ring-0 focus:outline-none ${
                  errors.konten_soal ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Tuliskan Soal . . ."
              />
              {errors.konten_soal && (
                <p className="text-red-500 text-sm mt-1">{errors.konten_soal}</p>
              )}
            </div>
            <div className="form-control my-3">
              {jawaban.map((jawaban, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="relative w-full my-3">
                    <input
                      type="radio"
                      name="jawaban_benar"
                      checked={jawaban.jawaban_benar}
                      onChange={() => handleRadioChange(index)}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 form-radio border-gray-300 rounded-md checked:bg-gray-400 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-[#689ECF]"
                    />
                    <input
                      type="text"
                      value={jawaban.konten_jawaban}
                      onChange={(e) =>
                        handleJawabanChange(index, "konten_jawaban", e.target.value)
                      }
                      className={`pl-8 input bg-white rounded-lg border p-1 w-full text-black focus:border-[#689ECF] focus:border-2 focus:ring-0 ${
                        errors[`jawaban_${index}`] ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder={`Masukkan Jawaban Opsi ${indexToLetter(index)}`}
                    />
                    {errors[`jawaban_${index}`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`jawaban_${index}`]}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="form-control my-3">
              <textarea
                rows={5}
                value={pembahasan}
                onChange={(e) => setPembahasan(e.target.value)}
                className={`bg-white rounded-lg border p-4 w-full focus:border-[#689ECF] focus:border-2 focus:ring-0 focus:outline-none ${
                  errors.pembahasan ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Tuliskan Jawaban dan Pembahasan Soal"
              />
              {errors.pembahasan && (
                <p className="text-red-500 text-sm mt-1">{errors.pembahasan}</p>
              )}
            </div>
            {errors.jawaban_benar && (
              <p className="text-red-500 text-sm mb-3">{errors.jawaban_benar}</p>
            )}
            <div className="w-full flex gap-2 justify-end">
              <button
                type="button"
                className="bg-[#E3D9CA] px-3 py-1 rounded-md text-black font-semibold text-md"
                style={{ boxShadow: "0 3px 0 0 #B1A6A6" }}
                onClick={handleChange}
              >
                Batal
              </button>
              {!isMutating ? (
                <button
                  type="submit"
                  className="bg-[#31B057] px-3 py-1 rounded-md text-white font-semibold text-md"
                  style={{ boxShadow: "0 3px 0 0 #237D3E" }}
                >
                  Simpan
                </button>
              ) : (
                <button type="button" className="btn loading">
                  Simpan...
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
