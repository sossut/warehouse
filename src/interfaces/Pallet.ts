import { RowDataPacket } from 'mysql2';
import { PalletProduct } from './PalletProduct';

interface Pallet {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  products?: PalletProduct[];
}

interface GetPallet extends RowDataPacket, Pallet {}

type PostPallet = Omit<Pallet, 'id'>;

type PutPallet = Partial<PostPallet>;

export { Pallet, GetPallet, PostPallet, PutPallet };
