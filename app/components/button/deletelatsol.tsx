"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Cookies from "js-cookie";

type Props = {
  id_latihan_soal: number;
  nama_latihansoal: string;
};

export default function DeleteLatsol(props: Props) {
  const [modal, setModal] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const router = useRouter();

  async function handleDelete(id_latihan_soal: number) {
    setIsMutating(true);

    try {
      const token = Cookies.get("UserToken");

      console.log("Current cookie:", token); // Added log
      if (!token) {
        throw new Error("User data not found. Please login again.");
      }

      const response = await fetch(`${apiUrl}/latihansoal/delete/${id_latihan_soal}`, {
        method: "DELETE",
        cache: "no-store",
        headers: {
          "Authorization": `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete Latihan Soal");
      }

      setIsMutating(false);
      router.refresh();
      setModal(false);
    } catch (error) {
      console.error(error);
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
              Batal
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
          {error && (
            <div className="text-red-500 text-sm mt-4">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
