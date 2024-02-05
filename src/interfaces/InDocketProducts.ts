import { RowDataPacket } from 'mysql2';

interface OutDocketProducts {
  id?: number;
  docketId: number;
  productId: number;
  orderedProductQuantity: number;
  receivedProductQuantity: number;
}

interface GetOutDocketProducts extends RowDataPacket, OutDocketProducts {}

type PostOutDocketProducts = Omit<OutDocketProducts, 'id'>;

type PutOutDocketProducts = Partial<PostOutDocketProducts>;

export {
  OutDocketProducts,
  GetOutDocketProducts,
  PostOutDocketProducts,
  PutOutDocketProducts
};
