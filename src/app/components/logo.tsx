import Image from "next/image";

export default function Logo({ inverted }: { inverted?: boolean }) {
  return (
    <div className="flex justify-center items-center gap-1">
      <Image
        src="/logo_w.svg"
        alt="Meinl Logo"
        width={32}
        height={32}
        className={inverted ? "inverted" : ""}
      />
      <p
        className={`text-2xl tracking-tighter ${
          inverted ? "text-[var(--foreground)]" : "text-[var(--background)]"
        }`}
      >
        DealerLocator
      </p>
    </div>
  );
}
