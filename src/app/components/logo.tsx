import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex justify-center items-center text-shadow-md text-shadow-white">
      <Image src="/logo.svg" alt="Meinl Logo" width={40} height={40} />
      <p className="text-2xl font-bold tracking-tight text-[var(--main)]">
        Dealers
      </p>
    </div>
  );
}
