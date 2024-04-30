"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Cookies from "js-cookie";

type Props = {
  id_latihan_soal: number;
  nama_latihansoal: string;
  isDisabled: boolean;
};

export default function SubmitUjian(props: Props) {
  const [modal, setModal] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const router = useRouter();
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  async function handleSubmit(id_latihan_soal: number) {
    setIsMutating(true);

    try {
      const userCookie = Cookies.get("user");
      if (!userCookie) {
        throw new Error("User data not found. Please login again.");
      }
      const userData = JSON.parse(userCookie);
      const token = userData.token;

      if (!token) {
        throw new Error("Token not found in user data.");
      }

      const res = await fetch(
        `${apiUrl}/ujian/${id_latihan_soal}/nilai`,
        {
          method: "POST",
          cache: "no-store",
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to submit answer.");
      }

      // Set cookie here if needed
      Cookies.set("submitted", "true");

      router.refresh();
      setModal(false);
    } catch (error: any) {
      console.error("Error submitting answer:", error.message);
    } finally {
      setIsMutating(false);
    }
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
              <Link href={`/exam/${props.id_latihan_soal}/result`}>
                <button
                  type="button"
                  className="bg-[#31B057] px-3 py-1 rounded-md text-white font-semibold text-md"
                  style={{ boxShadow: "0 3px 0 0 #237D3E" }}
                  onClick={() => handleSubmit(props.id_latihan_soal)}
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
