import React, { useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";

type Props = {
  id_latihan_soal: number;
  nama_latihan_soal: string;
  isDisabled: boolean;
  totalSoal: number;
  jawabanUser: number;
  onCheckAnswers: () => void; // Fungsi untuk memperbarui state jawabanUser
};

const SubmitUjian: React.FC<Props> = ({
  id_latihan_soal,
  nama_latihan_soal,
  isDisabled,
  totalSoal,
  jawabanUser,
  onCheckAnswers,
}) => {
  const [modal, setModal] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  useEffect(() => {
    if (modal && jawabanUser < totalSoal) {
      setShowIncompleteWarning(true);
    } else {
      setShowIncompleteWarning(false);
    }
  }, [modal, jawabanUser, totalSoal]);

  async function handleSubmit(id_latihan_soal: number) {
    setIsMutating(true);

    try {
      const token = Cookies.get("UserToken");
      if (!token) {
        throw new Error("User data not found. Please login again.");
      }

      // Lakukan validasi di sini untuk memastikan semua jawaban diisi
      const res = await fetch(`${apiUrl}/ujian/${id_latihan_soal}/nilai`, {
        method: "POST",
        cache: "no-store",
        headers: {
          Authorization: `${token}`,
        },
        body: JSON.stringify({ jawabanUser }) // Kirim jawabanUser ke backend
      });

      if (!res.ok) {
        throw new Error("Failed to submit answer.");
      }

      setModal(false);
    } catch (error: any) {
      console.error("Error submitting answer:", error.message);
    } finally {
      setIsMutating(false);
    }
  }

  function handleChange() {
    onCheckAnswers(); // Memanggil fungsi untuk memperbarui state jawabanUser saat modal terbuka
    setModal(!modal);
  }

  return (
    <div>
      <button
        className={`bg-[#5CB85C] px-6 py-3 rounded-xl text-white font-medium text-md ${
          isMutating || isDisabled ? "disabled" : ""
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
            Apakah Anda Yakin Ingin Mengirim ?
          </h3>
          {showIncompleteWarning && (
            <p className="text-red-500">Ada {totalSoal - jawabanUser} soal yang belum dikerjakan!</p>
          )}
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
              <Link href={`/exam/${id_latihan_soal}/result`}>
                <button
                  type="button"
                  className="bg-[#31B057] px-3 py-1 rounded-md text-white font-semibold text-md"
                  style={{ boxShadow: "0 3px 0 0 #237D3E" }}
                  onClick={() => handleSubmit(id_latihan_soal)}
                >
                  Kirim
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
};

export default SubmitUjian;
