export interface Dealer {
  addresse: {
    name1: string | null;
    name2: string | null;
    name3: string | null;
    telefon: string | null;
    email: string | null;
    www: string | null;
    bild: string | null;
    strasse: string | null;
    plz: string | null;
    ort: string | null;
    land: string | null;
    zusatz: string | null;
    longitude: string | null;
    latitude: string | null;
  };
  warengruppen: Array<ProductGroup>;
  kdnr: string;
  vanr: number;
}

interface ProductGroup {
  wgr1: string;
  wgr2: string;
  wgr3: string;
  wgr4: string;
  wgr5: string;
  wert: string;
  bild: string;
  storeAdrNr: number;
  storeAnpNr: number;
  urlNr: number;
}

export interface Location {
  latitude: number;
  longitude: number;
}
