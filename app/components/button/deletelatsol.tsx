"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Snackbar } from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Image from "next/image";

type Props = {
  id_latihan_soal: number;
  nama_latihansoal: string;
};

export default function DeleteLatsol(props: Props) {
  const [modal, setModal] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const router = useRouter();

  async function handleDelete(id_latihan_soal: number) {
    setIsMutating(true);

    await fetch(`${apiUrl}/latihansoal/delete-latihansoal/${id_latihan_soal}`, {
      method: "DELETE",
      cache: "no-store",
    });

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
        <Image src="/delete.png" alt="delete" width={16} height={16} />
      </div>

      <input
        type="checkbox"
        checked={modal}
        onChange={handleChange}
        className="modal-toggle"
      />

      <div className="modal">
        <div className="modal-box bg-slate-100">
          <h3 className="font-bold text-lg text-gray-800 mb-8">
            Are you sure to delete {props.nama_latihansoal} ?
          </h3>
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
                type="button"
                onClick={() => handleDelete(props.id_latihan_soal)}
                className="bg-[#FF4343] px-3 py-1 rounded-md text-white font-semibold text-md"
                style={{ boxShadow: "0 3px 0 0 #BC3434" }}
              >
                Delete
              </button>
            ) : (
              <button type="button" className="btn loading">
                Deleting...
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
