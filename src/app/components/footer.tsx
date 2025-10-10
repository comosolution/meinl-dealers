export default function Footer() {
  return (
    <footer className="flex flex-col items-center gap-1 p-4 text-center">
      <p className="text-xs">© Roland Meinl Musikinstrumente GmbH & Co. KG</p>
      <nav className="flex gap-4">
        {[
          { name: "Imprint", href: "https://meinl.de/en/imprint" },
          {
            name: "Privacy Policy",
            href: "https://meinl.de/en/privacy-policy",
          },
        ].map((l, i) => (
          <a key={i} href={l.href} className="link text-xs">
            {l.name}
          </a>
        ))}
      </nav>
    </footer>
  );
}
