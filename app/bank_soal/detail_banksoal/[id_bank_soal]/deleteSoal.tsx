"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Props {
  id_soal: number;
}

export default function DeleteSoal({ id_soal}: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setIsMutating(true);

    await fetch(`https://latsol.ilhamirfan.my.id/soal/delete-soal/${id_soal}`, {
      method: "DELETE",
      cache: "no-store",
    });

    setIsMutating(false);
    router.refresh();
    setConfirmDelete(false);
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
          <h3 className="font-bold text-xl text-gray-800 mb-4">Confirm Delete</h3>
          <p>Are you sure you want to delete? This action cannot be undone.</p>
          <div className="w-full flex gap-2 justify-end mt-4">
            <button
              type="button"
              className="bg-[#E3D9CA] px-3 py-1 rounded-md text-black font-semibold text-md"
              style={{ boxShadow: "0 3px 0 0 #B1A6A6" }}
              onClick={handleConfirmDelete}
            >
              Cancel
            </button>
            {!isMutating ? (
              <button
                type="button"
                className="bg-[#E57373] px-3 py-1 rounded-md text-white font-semibold text-md"
                style={{ boxShadow: "0 3px 0 0 #B75D5D" }}
                onClick={handleDelete}
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
