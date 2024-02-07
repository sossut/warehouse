import { RowDataPacket } from 'mysql2';

interface InDocketProduct {
  id?: number;
  inDocketId: number;
  productId: number;
  orderedProductQuantity: number;
  receivedProductQuantity: number;
}

interface GetInDocketProduct extends RowDataPacket, InDocketProduct {}

type PostInDocketProduct = Omit<InDocketProduct, 'id'>;

type PutInDocketProduct = Partial<PostInDocketProduct>;

export {
  InDocketProduct,
  GetInDocketProduct,
  PostInDocketProduct,
  PutInDocketProduct
};
