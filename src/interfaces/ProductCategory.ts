import { RowDataPacket } from 'mysql2';

interface ProductCategory {
  id: number;
  name: string;
}

interface GetProductCategory extends RowDataPacket, ProductCategory {}

type PostProductCategory = Omit<ProductCategory, 'id'>;

type PutProductCategory = Partial<PostProductCategory>;

export {
  ProductCategory,
  GetProductCategory,
  PostProductCategory,
  PutProductCategory
};
