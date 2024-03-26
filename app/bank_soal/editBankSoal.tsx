"use client";

import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
    id_bank_soal: number;
    nama_banksoal: string;
};

export default function EditBankSoal(props : Props) {
  const [nama_banksoal, setNama_Banksoal] = useState(props.nama_banksoal);
  const [modal, setModal] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const router = useRouter();

  async function handleUpdate(e: SyntheticEvent) {
    e.preventDefault();

    setIsMutating(true);

    await fetch(`http://192.168.1.19:3000/banksoal/edit-banksoal/${props.id_bank_soal}`, {
      method: "PATCH",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nama_banksoal: nama_banksoal,
      }),
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
      <button className="btn btn-accent text-white" onClick={handleChange}>
        edit
      </button>
      <input
        type="checkbox"
        checked={modal}
        onChange={handleChange}
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box bg-slate-100">
          <h3 className="font-bold text-xl text-gray-800 mb-4">Edit {props.nama_banksoal}</h3>
          <form onSubmit={handleUpdate}>
            <div className="form-control">
              <label className="label font-semibold text-gray-800">Nama : </label>
              <input
                type="text"
                value={nama_banksoal}
                onChange={(e) => setNama_Banksoal(e.target.value)}
                className="input w-full input-bordered bg-slate-200 text-slate-800"
                placeholder="Nama Bank Soal"
              />
            </div>
            <div className="modal-action">
              <button type="button" className="btn btn-outline text-accent hover:text-white hover:bg-accent" onClick={handleChange}>
                close
              </button>
              {!isMutating ? (
                <button type="submit" className="btn btn-accent text-white">
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
