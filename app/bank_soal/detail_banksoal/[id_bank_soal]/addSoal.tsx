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
    { konten_jawaban: "", jawaban_benar: "" },
    { konten_jawaban: "", jawaban_benar: "" },
    { konten_jawaban: "", jawaban_benar: "" },
    { konten_jawaban: "", jawaban_benar: "" },
  ]);
  const [modal, setModal] = useState(false);
  const [useTextForm, setUseTextForm] = useState(true);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileSoal(file);
  };

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();

    console.log("Mengirim formulir dengan data:", {
      konten_soal: konten_soal,
      jawaban: jawabanList,
      fileSoal: fileSoal,
      pembahasan: pembahasan,
    });

    const url = new URL(
      `https://latsol.ilhamirfan.my.id/soal/${id_bank_soal}/add-soal`,
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

    setKontenSoal("");
    setFileSoal(null);
    setPembahasan("");
    setJawaban_Benar(null);
    setJawabanList([
      { konten_jawaban: "", jawaban_benar: "" },
      { konten_jawaban: "", jawaban_benar: "" },
      { konten_jawaban: "", jawaban_benar: "" },
      { konten_jawaban: "", jawaban_benar: "" },
    ]);
    router.refresh();
    setModal(false);
  }

  function handleChange() {
    console.log("Modal state changed");
    setModal(!modal);
  }

  return (
    <div>
      <button
        className="text-white w-full bg-[#5CB85C] py-3 rounded-lg text-md font-semibold mb-8 flex justify-center items-center"
        style={{ boxShadow: "0 3px 0 0 #51656A" }}
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
          <h3 className="font-bold text-lg text-gray-800">Tambah Soal</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              {useTextForm ? (
                <textarea
                value={konten_soal}
                rows={5}
                onChange={(e) => setKontenSoal(e.target.value)}
                className="bg-white rounded-lg border border-gray-300 p-4 w-full "
                placeholder="Tuliskan Soal. . ."
              />
              ) : (
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered w-full bg-slate-200 text-slate-400"
                />
              )}
            </div>
            <div className="form-control">
              <label className="label font-bold text-gray-800">Jawaban</label>
              {jawabanList.map((jawaban, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="jawaban_benar"
                    value={index.toString()}
                    checked={jawaban_benar === index.toString()}
                    onChange={() => handleJawabanBenarChange(index)}
                    className="radio"
                  />
                  <input
                    type="text"
                    value={jawaban.konten_jawaban}
                    onChange={(e) => handleJawabanChange(index, e.target.value)}
                    className="input bg-white rounded-lg border border-gray-300 p-1 w-full text-black"
                    placeholder={`Masukkan Jawaban Opsi ${indexToLetter(index)}`}
                  />
                </div>
              ))}
            </div>
            <div className="form-control">
              <label className="label font-bold text-gray-800">
                Pembahasan
              </label>
              <textarea
                value={pembahasan}
                onChange={(e) => setPembahasan(e.target.value)}
                className="bg-white rounded-lg border border-gray-300 p-1 w-full "
                placeholder="Masukkan Pembahasan"
              />
            </div>
            <div className="form-control">
              <label className="label font-bold text-gray-800">
                Pilih Jenis Soal
              </label>
              <div className="flex items-center">
                <label className="label font-medium text-gray-800">
                  <input
                    type="radio"
                    name="jenis_soal"
                    value="text"
                    checked={useTextForm}
                    onChange={() => setUseTextForm(true)}
                    className="checkbox checkbox-accent mr-2"
                  />
                  Soal Teks
                </label>
              </div>
              <div className="flex items-center">
                <label className="label font-medium text-gray-800">
                  <input
                    type="radio"
                    name="jenis_soal"
                    value="file"
                    checked={!useTextForm}
                    onChange={() => setUseTextForm(false)}
                    className="checkbox checkbox-accent mr-2"
                  />
                  Soal File
                </label>
              </div>
            </div>
            <div className="modal-action">
              <button
                className="btn btn btn-outline text-accent hover:text-white hover:bg-accent"
                type="button"
                onClick={handleChange}
              >
                close
              </button>
              <button
                className="btn btn-accent text-white"
                type="submit"
                style={{ backgroundColor: "#5CB85C" }}
              >
                add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSoal;
