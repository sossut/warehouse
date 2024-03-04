import { RowDataPacket } from 'mysql2';
import { OutDocket } from './OutDocket';
import { InDocket } from './InDocket';
import { Product } from './Product';

interface ProductHistory {
  id: number;
  productId: number | Product;
  quantity: number;
  createdAt: Date;
  outDocketId?: number | OutDocket;
  inDocketId?: number | InDocket;
  manual?: 'yes' | 'no';
}

interface GetProductHistory extends RowDataPacket, ProductHistory {}

type PostProductHistory = Omit<ProductHistory, 'id' | 'createdAt'>;

type PutProductHistory = Omit<ProductHistory, 'createdAt'>;

export {
  ProductHistory,
  GetProductHistory,
  PostProductHistory,
  PutProductHistory
};
