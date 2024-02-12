import { RowDataPacket } from 'mysql2';
import { Product } from './Product';
import { BackOrderOutDocket } from './BackOrderOutDocket';

interface BackOrderOutDocketProducts {
  id: number;
  backOrderOutDocketId: number | BackOrderOutDocket;
  productId: number | Product;
  orderedProductQuantity: number;
  deliveredProductQuantity: number;
}

interface GetBackOrderOutDocketProducts
  extends RowDataPacket,
    BackOrderOutDocketProducts {}

type PostBackOrderOutDocketProducts = Omit<BackOrderOutDocketProducts, 'id'>;

type PutBackOrderOutDocketProducts = Partial<PostBackOrderOutDocketProducts>;

export {
  BackOrderOutDocketProducts,
  GetBackOrderOutDocketProducts,
  PostBackOrderOutDocketProducts,
  PutBackOrderOutDocketProducts
};
