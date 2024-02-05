import { RowDataPacket } from 'mysql2';
import { PalletProduct } from './PalletProduct';
import { Spot } from './Spot';
import { FloorSpot } from './FloorSpot';

interface Pallet {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  products?: PalletProduct[];
  spotId?: number | Spot;
  floorSpotId?: number | FloorSpot;
}

interface GetPallet extends RowDataPacket, Pallet {}

type PostPallet = Omit<Pallet, 'id'>;

type PutPallet = Partial<PostPallet>;

export { Pallet, GetPallet, PostPallet, PutPallet };
