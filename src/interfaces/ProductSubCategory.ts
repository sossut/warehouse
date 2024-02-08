import { RowDataPacket } from 'mysql2';
import { ProductCategory } from './ProductCategory';

interface ProductSubCategory {
  id: number;
  name: string;
  productCategoryId: number | ProductCategory;
}

interface GetProductSubCategory extends RowDataPacket, ProductSubCategory {}

type PostProductSubCategory = Omit<ProductSubCategory, 'id'>;

type PutProductSubCategory = Partial<PostProductSubCategory>;

export {
  ProductSubCategory,
  GetProductSubCategory,
  PostProductSubCategory,
  PutProductSubCategory
};
