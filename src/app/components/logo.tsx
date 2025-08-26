import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex justify-center items-center">
      <Image src="/logo.svg" alt="Meinl Logo" width={36} height={36} />
      <p className="text-2xl tracking-tighter text-[var(--main)]">
        DealerLocator
      </p>
    </div>
  );
}
