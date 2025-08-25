import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex justify-center items-center cursor-pointer hover:opacity-80">
      <Image src="/logo.svg" alt="Meinl Logo" width={40} height={40} />
      <p className="text-xl font-bold tracking-tighter text-[var(--main)]">
        Dealers
      </p>
    </div>
  );
}
