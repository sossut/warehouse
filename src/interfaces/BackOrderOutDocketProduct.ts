import { RowDataPacket } from 'mysql2';
import { Product } from './Product';
import { BackOrderOutDocket } from './BackOrderOutDocket';

interface BackOrderOutDocketProduct {
  id: number;
  backOrderOutDocketId: number | BackOrderOutDocket;
  productId: number | Product;
  orderedProductQuantity: number;
  deliveredProductQuantity: number;
}

interface GetBackOrderOutDocketProduct
  extends RowDataPacket,
    BackOrderOutDocketProduct {}

type PostBackOrderOutDocketProduct = Omit<BackOrderOutDocketProduct, 'id'>;

type PutBackOrderOutDocketProduct = Partial<PostBackOrderOutDocketProduct>;

export {
  BackOrderOutDocketProduct,
  GetBackOrderOutDocketProduct,
  PostBackOrderOutDocketProduct,
  PutBackOrderOutDocketProduct
};
