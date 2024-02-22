import { RowDataPacket } from 'mysql2';

import { ReceivedInDocket } from './ReceivedInDocket';
import { Product } from './Product';

interface ReceivedInDocketProduct {
  id?: number;
  receivedInDocketId: number | ReceivedInDocket;
  productId: number | Product;
  orderedProductQuantity: number;
  deliveredProductQuantity: number;
}

interface GetReceivedInDocketProduct
  extends RowDataPacket,
    ReceivedInDocketProduct {}

type PostReceivedInDocketProduct = Omit<ReceivedInDocketProduct, 'id'>;

type PutReceivedInDocketProduct = Partial<PostReceivedInDocketProduct>;

export {
  ReceivedInDocketProduct,
  GetReceivedInDocketProduct,
  PostReceivedInDocketProduct,
  PutReceivedInDocketProduct
};
