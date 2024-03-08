import { Image } from './images.interface';
export interface Product {
  id:           number;
  name:         string;
  unitaryPrice: number;
  cost:         number;
  stock:        number;
  state:        number;
  imageUrl:     string;
  description?:  string;
  images?:      Image[];
}

