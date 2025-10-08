import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex justify-center items-center gap-1">
      <Image src="/logo_w.svg" alt="Meinl Logo" width={32} height={32} />
      <p className="text-2xl tracking-tighter text-[var(--background)]">
        DealerLocator
      </p>
    </div>
  );
}
