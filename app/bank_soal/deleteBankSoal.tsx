"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Snackbar } from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

type Props = {
  id_bank_soal: number;
  nama_banksoal: string;
};

export default function DeleteBankSoal(props: Props) {
  const [modal, setModal] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const router = useRouter();

  async function handleDelete(id_bank_soal: number) {
    setIsMutating(true);

    await fetch(
      `http://192.168.1.19:3000/banksoal/delete-banksoal/${id_bank_soal}`,
      {
        method: "DELETE",
        cache: "no-store",
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
      <button className="btn btn-error text-white" onClick={handleChange}>
        Delete
      </button>

      <input
        type="checkbox"
        checked={modal}
        onChange={handleChange}
        className="modal-toggle"
      />

      <div className="modal">
        <div className="modal-box bg-slate-100">
          <h3 className="font-bold text-lg text-gray-800">
            Are you sure to delete {props.nama_banksoal} ?
          </h3>
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-outline text-error hover:text-white hover:bg-error"
              onClick={handleChange}
            >
              Close
            </button>
            {!isMutating ? (
              <button
                type="button"
                onClick={() => handleDelete(props.id_bank_soal)}
                className="btn btn-error text-white"
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
