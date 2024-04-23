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
        className={`bg-[#5CB85C] px-6 py-3 rounded-xl text-white font-medium text-md ${
          isMutating || props.isDisabled ? "disabled" : ""
        }`}
        onClick={handleChange}
        style={{
          boxShadow: "0 3px 0 0 #51656A",
        }}
      >
        Selesai
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
              className="bg-[#E3D9CA] px-3 py-1 rounded-md text-black font-semibold text-md"
              style={{ boxShadow: "0 3px 0 0 #B1A6A6" }}
              onClick={handleChange}
            >
              Close
            </button>
            {!isMutating ? (
              <Link href={"/exam/result"}>
                <button
                  type="button"
                  className="bg-[#31B057] px-3 py-1 rounded-md text-white font-semibold text-md"
                  style={{ boxShadow: "0 3px 0 0 #237D3E" }}
                >
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
