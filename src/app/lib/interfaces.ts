export interface Dealer {
  kdnr: string;
  vanr: string;
  name1: string;
  name2: string;
  name3: string;
  postalAddress: {
    street: string;
    zip: string;
    city: string;
    country: string;
  };
  phone: string;
  email: string;
  www: string;
  coordinates: Location;
  brands: string[];
}

export interface Location {
  latitude: number;
  longitude: number;
  distance?: number;
}
