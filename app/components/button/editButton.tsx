import { useRouter } from 'next/navigation';
import Image from "next/image";
import React from 'react';

export default function EditButton({ id_latihan_soal }) {
    const router = useRouter();

    function handleClick() {
        router.push(`/edit/${id_latihan_soal}`);
    }

    return (
        <>
            <button onClick={handleClick} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}>
                <Image
                    src={"/edit.png"}
                    width={19}
                    height={19}
                    alt={""}
                    className="mr-1"
                />
            </button>
        </>
    );
}
