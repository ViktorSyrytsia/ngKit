import { IImage } from './image.model';
import { ISizes } from './sizes.model';

export interface IProduct {
  id: string;
  category: string;
  subcategory: string;
  name: string;
  price: number;
  description: string;
  sizes: ISizes;
  images: IImage[];
}
