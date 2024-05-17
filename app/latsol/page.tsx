import Link from "next/link";
import CardLatsolAdmin from "../components/card/cardLatsolAdmin";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Image from "next/image";

export const metadata = {
  title: "Latihan Soal",
};

type Props = {
  id_latihan_soal: number;
  nama_latihansoal: string;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getLatsol() {
  const res = await fetch(`${apiUrl}/latihansoal`, {
    method: "GET",
    cache: "no-store",
  });
  const data = await res.json();
  return data;
}

export default async function LatihansoalList() {
  const props: Props[] = await getLatsol();

  function handleChange() {
    console.log("Modal state changed");
    setModal(!modal);
  }

  return (
    <main>
 <div>
      <button
        className="text-white w-full bg-[#5CB85C] py-3 rounded-lg text-md font-semibold mb-8 flex justify-center items-center"
        style={{ boxShadow: "0 3px 0 0 #51656A" }}
        onClick={handleChange}
      >
        <span className="text-md font-semibold mr-2">+</span> Tambah Soal
      </button>
      <input
        type="checkbox"
        checked={modal}
        onChange={handleChange}
        className="modal-toggle"
      />
      <div className="w-full bg-white py-8">
        <div className="w-full max-w-screen-md mx-auto px-4">
          <div className="flex w-full items-center justify-between mt-3 mb-12">
            <Link href={"/"}>
              <ArrowBackIosNewIcon className="text-black" />
            </Link>
            <h1 className="font-bold text-black text-[20px] cursor-pointer hover:underline">
              Bank Soal
            </h1>
            <div className="w-8 h-8 relative rounded-full">
              <Image
                src="/avatar.png"
                alt="Avatar"
                layout="fill"
                className="rounded-full"
              />
            </div>
          </div>
          <form className="w-full">
            <input
              type="text"
              placeholder="Ayo cari bank soalmu..."
              className="w-full rounded-full border bg-white border-gray-300 p-3 placeholder-[#BABEC6] mb-8 text-black"
            />
          </form>
          <div>
            {props.map((prop: any, index: number) => (
              <CardLatsolAdmin
                key={index}
                id_latihan_soal={prop.id_latihan_soal}
                nama_latihansoal={prop.nama_latihansoal}
                durasi={0}
                tag={[]}
              />
            ))}
          </div>
          </div>
        </div>
      </div>
    </main>
  );
}
function setModal(arg0: boolean) {
  throw new Error("Function not implemented.");
}

