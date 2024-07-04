"use client";

import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Cookies from "js-cookie";

type Props = {
  id_bank_soal: number;
  nama_banksoal: string;
};

export default function EditBankSoal(props: Props) {
  const [nama_banksoal, setNama_Banksoal] = useState(props.nama_banksoal);
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

      const response = await fetch(`${apiUrl}/banksoal/edit-banksoal/${props.id_bank_soal}`, {
        method: "PATCH",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`,
        },
        body: JSON.stringify({
          nama_banksoal: nama_banksoal,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update Bank Soal");
      }

      setIsMutating(false);
      router.refresh();
      setModal(false);
    } catch (error) {
      console.error(error);
      setError(error.message);
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
            Edit {props.nama_banksoal}
          </h3>
          <form onSubmit={handleUpdate}>
            <div className="form-control">
              <label className="label font-semibold text-[#9CA3AF]">
                Nama :{" "}
              </label>
              <input
                type="text"
                value={nama_banksoal}
                onChange={(e) => setNama_Banksoal(e.target.value)}
                className="input w-full input-bordered bg-slate-200 text-slate-800 mb-8"
                placeholder="Nama Bank Soal"
              />
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
