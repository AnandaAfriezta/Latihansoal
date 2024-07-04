"use client";

import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Cookies from "js-cookie";

type Props = {
  id_latihan_soal: number;
  id_bank_soal: number;
  nama_latihansoal: string;
  durasi: number;
  status: string; // Assuming status is a number (1 for "Aktif" and 0 for "Arsip")
};

export default function EditLatsol(props: Props) {
  const [nama_latihansoal, setNama_latihansoal] = useState(props.nama_latihansoal);
  const [durasi, setDurasi] = useState(props.durasi);
  const [id_bank_soal, setid_bank_soal] = useState(props.id_bank_soal);
  const [status, setStatus] = useState(props.status);
  const [modal, setModal] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const router = useRouter();

  async function handleUpdate(e: SyntheticEvent) {
    e.preventDefault();
    setIsMutating(true);

    try {
      const token = Cookies.get("UserToken");
      console.log("Current cookie:", token); // Added log
      if (!token) {
        throw new Error("User data not found. Please login again.");
      }

      const response = await fetch(
        `${apiUrl}/latihansoal/update/${props.id_latihan_soal}`,
        {
          method: "PATCH",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `${token}`,
          },
          body: JSON.stringify({
            id_bank_soal: id_bank_soal,
            nama_latihansoal: nama_latihansoal,
            durasi: durasi,
            status: status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update Latihan Soal");
      }

      setIsMutating(false);
      router.refresh();
      setModal(false);
    } catch (error) {
      console.error(error);
      setIsMutating(false);
    }
  }

  function handleChange() {
    setModal(!modal);
    setError(null);
  }

  return (
    <div>
      <div onClick={handleChange}>
        <Image src="/edit.png" alt="edit" width={16} height={16} />
      </div>
      <input
        type="checkbox"
        checked={modal}
        onChange={handleChange}
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box bg-slate-100">
          <h3 className="font-bold text-xl text-gray-800 mb-4">
            Edit {props.nama_latihansoal}
          </h3>
          <form onSubmit={handleUpdate}>
            <div className="form-control">
              <label className="label font-semibold text-[#9CA3AF]">
                Nama :
              </label>
              <input
                type="text"
                value={nama_latihansoal}
                onChange={(e) => setNama_latihansoal(e.target.value)}
                className="input w-full input-bordered bg-slate-200 text-slate-800 mb-8"
                placeholder="Nama latihan soal"
              />
              <input
                type="number"
                value={durasi}
                onChange={(e) => setDurasi(Number(e.target.value))}
                className="input w-full input-bordered bg-slate-200 text-slate-800 mb-8"
                placeholder="Durasi latihan soal"
              />
              <label className="label font-semibold text-[#9CA3AF]">
                Status :
              </label>
              <div className="flex gap-2 mb-8">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={status === 'Aktif'}
                    onChange={(e) => setStatus(e.target.checked ? "Aktif" : "Arsip")}
                    className="toggle toggle-primary"
                  />
                  <span className="ml-2">{status === "Aktif" ? "Aktif" : "Arsip"}</span>
                </label>
              </div>
            </div>
            {error && (
              <div className="text-red-500 text-sm mb-4">
                {error}
              </div>
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
                  Update
                </button>
              ) : (
                <button type="button" className="btn loading">
                  Updating...
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
