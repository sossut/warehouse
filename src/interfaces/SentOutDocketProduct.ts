import { RowDataPacket } from 'mysql2';

interface SentOutDocketProduct {
  id: number;
  sentOutDocketId: number;
  productId: number;
  orderedProductQuantity: number;
  deliveredProductQuantity: number;
}

interface GetSentOutDocketProduct extends RowDataPacket, SentOutDocketProduct {}

type PostSentOutDocketProduct = Omit<SentOutDocketProduct, 'id'>;

type PutSentOutDocketProduct = Partial<PostSentOutDocketProduct>;

export {
  SentOutDocketProduct,
  GetSentOutDocketProduct,
  PostSentOutDocketProduct,
  PutSentOutDocketProduct
};
