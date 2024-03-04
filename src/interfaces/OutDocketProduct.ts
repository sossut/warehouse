import { RowDataPacket } from 'mysql2';
import { OutDocket } from './OutDocket';
import { Product } from './Product';

interface OutDocketProduct {
  id?: number;
  outDocketId: number | OutDocket;
  productId: number | Product;
  orderedProductQuantity: number;
  deliveredProductQuantity: number;
  outDocketProductId?: number;
}

interface GetOutDocketProduct extends RowDataPacket, OutDocketProduct {}

type PostOutDocketProduct = Omit<OutDocketProduct, 'id'>;

type PutOutDocketProduct = Partial<PostOutDocketProduct>;

export {
  OutDocketProduct,
  GetOutDocketProduct,
  PostOutDocketProduct,
  PutOutDocketProduct
};
