import Image from "next/image";

export default function Loader() {
  return (
    <div className="w-screen h-screen flex justify-center items-center p-8">
      <Image
        src="/logo_b.svg"
        alt="Meinl Logo"
        width={48}
        height={48}
        className="animate-spin"
      />
    </div>
  );
}
