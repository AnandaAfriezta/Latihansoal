"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {
  id_latihan_soal: number;
  nama_latihansoal: string;
  isDisabled: boolean;
};

export default function SubmitUjian(props: Props) {
  const [modal, setModal] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const router = useRouter();

  async function handleSubmit(id_latihan_soal: number) {
    setIsMutating(true);

    await fetch(`http://10.28.1.92:3000/latihansoal/${id_latihan_soal}`, {
      method: "GET",
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
      <button
        className={`btn btn-accent text-white btn-block flex flex-col ${
          isMutating || props.isDisabled ? "disabled" : ""
        }`}
        onClick={handleChange}
        disabled={isMutating || props.isDisabled}
      >
        Submit
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
            Are you sure you want to submit {props.nama_latihansoal} ?
          </h3>
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-outline text-accent hover:text-white hover:bg-accent"
              onClick={handleChange}
            >
              Close
            </button>
            {!isMutating ? (
              <Link href={"/exam/result"}>
                <button type="button" className="btn btn-accent text-white">
                  Submit
                </button>
              </Link>
            ) : (
              <button type="button" className="btn loading">
                Submitting...
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
