import Link from "next/link";
import CardBankSoal from "../components/card/cardBankSoal";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export const metadata = {
  title: "Bank Soal",
};

type Props = {
  id_bank_soal: number;
  nama_banksoal: string;
};

async function getBankSoal() {
  const res = await fetch("http://192.168.1.19:3000/banksoal/", {
    cache: "no-store",
  });
  return res.json();
}

export default async function BankSoalList() {
  const props: Props[] = await getBankSoal();

  return (
    <main>
      <div className="w-full bg-slate-100 py-8">
        <div className="w-full max-w-screen-md mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8 mt-3 mb-4">
              <Link href={"/"}>
                <ArrowBackIosNewIcon className="text-primary" />
              </Link>
              <h1 className="font-bold text-primary text-4xl cursor-pointer hover:underline">
                Bank Soal
              </h1>
            </div>
          </div>
          <div>
            {props.map((prop: any, index: number) => (
              <CardBankSoal
                key={index}
                id_bank_soal={prop.id_bank_soal}
                nama_banksoal={prop.nama_banksoal}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
