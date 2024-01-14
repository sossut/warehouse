import { RowDataPacket } from 'mysql2';
import { Docket } from './Docket';
import { Product } from './Product';
import { QuantityOption } from './QuantityOption';

interface DocketProduct {
  id?: number;
  docketId: number | Docket;
  productId: number | Product;
  productQuantity: number;
  quantityOptionId: number | QuantityOption;
}

interface GetDocketProduct extends RowDataPacket, DocketProduct {}

type PostDocketProduct = Omit<DocketProduct, 'id'>;

type PutDocketProduct = Partial<PostDocketProduct>;

export { DocketProduct, GetDocketProduct, PostDocketProduct, PutDocketProduct };
