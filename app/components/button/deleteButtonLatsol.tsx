import { useRouter } from 'next/navigation';
import Image from "next/image";
import React from 'react';

export default function DeleteButton({ id_latihan_soal }) {
    const router = useRouter();

    function handleDeleteClick() {
        // Logika untuk menghapus data, misalnya AJAX request atau navigasi ke halaman konfirmasi penghapusan
        console.log(`Hapus item dengan ID ${id_latihan_soal}`);
    }

    return (
        <>
            {/* Tombol delete */}
            <button onClick={handleDeleteClick} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}>
                <Image
                    src={"/hapus.png"}
                    width={19}
                    height={19}
                    alt={"Delete"}
                    className="ml-1"
                />
            </button>
        </>
    );
}
