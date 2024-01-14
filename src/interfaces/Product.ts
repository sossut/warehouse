import { RowDataPacket } from 'mysql2';

interface Product {
  id: number;
  name: string;
  code: string;
  weight: number;
}

interface GetProduct extends RowDataPacket, Product {}

type PostProduct = Omit<Product, 'id'>;

type PutProduct = Partial<PostProduct>;

export { Product, GetProduct, PostProduct, PutProduct };
