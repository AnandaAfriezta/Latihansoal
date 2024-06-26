"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Cookies from "js-cookie";

interface Props {
  id_soal: number;
}

export default function DeleteSoal({ id_soal }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  async function handleDelete() {
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

      await fetch(`${apiUrl}/soal/delete-soal/${id_soal}`, {
        method: "DELETE",
        cache: "no-store",
        headers: {
          Authorization: `${token}`,
        },
      });

      setIsMutating(false);
      router.refresh();
      setConfirmDelete(false);
    } catch (error) {
      console.error(error);
      // Handle error, e.g., show error message to user
      setIsMutating(false);
    }
  }

  function handleConfirmDelete() {
    setConfirmDelete(!confirmDelete);
  }

  return (
    <div>
      <div onClick={handleConfirmDelete}>
        <Image src="/delete.png" alt="delete" width={16} height={16} />
      </div>
      <input
        type="checkbox"
        checked={confirmDelete}
        onChange={handleConfirmDelete}
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box bg-slate-100">
          <h3 className="font-bold text-xl text-gray-800 mb-4">Hapus</h3>
          <p>Apa anda yakin ingin menghapus?</p>
          <div className="w-full flex gap-2 justify-end mt-4">
            <button
              type="button"
              className="bg-[#E3D9CA] px-3 py-1 rounded-md text-black font-semibold text-md"
              style={{ boxShadow: "0 3px 0 0 #B1A6A6" }}
              onClick={handleConfirmDelete}
            >
              Batal
            </button>
            {!isMutating ? (
              <button
                type="button"
                className="bg-[#E86262] px-3 py-1 rounded-md text-white font-semibold text-md"
                style={{ boxShadow: "0 3px 0 0 #B21A1A" }}
                onClick={handleDelete}
              >
                Hapus
              </button>
            ) : (
              <button type="button" className="btn loading">
                Hapus...
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
