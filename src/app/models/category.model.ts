import { IImage } from './image.model';

export interface ICategory {
  id?: string;
  name: string;
  image: IImage;
  description: string;
}
