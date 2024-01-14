import { RowDataPacket } from 'mysql2';
import { Pallet } from './Pallet';
import { Product } from './Product';

interface PalletProduct {
  id?: number;
  palletId: number | Pallet;
  productId: number | Product;
  quantity: number;
}

interface GetPalletProduct extends RowDataPacket, PalletProduct {}

type PostPalletProduct = Omit<PalletProduct, 'id'>;

type PutPalletProduct = Partial<PostPalletProduct>;

export { PalletProduct, GetPalletProduct, PostPalletProduct, PutPalletProduct };
