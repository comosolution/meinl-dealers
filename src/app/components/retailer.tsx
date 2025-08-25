import { Dealer } from "../lib/interfaces";

export function Retailer({
  retailer,
  handleRetailerClick,
  active,
  innerRef,
}: {
  retailer: Dealer;
  handleRetailerClick: (id: string) => void;
  active: boolean;
  innerRef?: React.Ref<HTMLDivElement>;
}) {
  const address = `${retailer.addresse.strasse}, ${retailer.addresse.plz} ${retailer.addresse.ort}`;

  return (
    <div
      ref={innerRef}
      className={`flex flex-col gap-4 p-4 bg-[var(--foreground)] text-white border ${
        active ? "border-[var(--main)]" : "border-white/20"
      }`}
      tabIndex={0}
      onClick={() => handleRetailerClick(retailer.kdnr)}
    >
      <header className="flex flex-col">
        <h3 className="text-xl font-bold tracking-tight">
          {retailer.addresse.name1}
        </h3>
        <p className="text-xs dimmed">{address}</p>
      </header>

      {active && (
        <div className="flex flex-wrap gap-1">
          {retailer.warengruppen.map(
            (w, i) =>
              w.wgr1 !== "" && (
                <p
                  key={i}
                  className="text-xs px-2 py-1 shadow-black/20 ring-1 ring-neutral-300 shadow-2xl"
                >
                  {w.wgr1} {w.wgr2} {w.wgr3} {w.wgr4} {w.wgr5}
                </p>
              )
          )}
        </div>
      )}
    </div>
  );
}
