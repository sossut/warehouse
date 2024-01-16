import { RowDataPacket } from 'mysql2';
import { QuantityOption } from './QuantityOption';

interface Product {
  id: number;
  name: string;
  code: string;
  weight: number;
  quantity: number;
  quantityOptionId: number | QuantityOption;
}

interface GetProduct extends RowDataPacket, Product {}

type PostProduct = Omit<Product, 'id'>;

type PutProduct = Partial<PostProduct>;

export { Product, GetProduct, PostProduct, PutProduct };
