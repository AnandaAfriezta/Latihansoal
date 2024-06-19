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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const router = useRouter();

  async function handleUpdate(e: SyntheticEvent) {
    e.preventDefault();

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
    await fetch(
      `${apiUrl}/banksoal/edit-banksoal/${props.id_bank_soal}`,
      {
        method: "PATCH",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama_banksoal: nama_banksoal,
        }),
      },
    );
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
