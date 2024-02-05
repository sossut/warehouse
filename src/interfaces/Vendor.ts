import { RowDataPacket } from 'mysql2';

interface Vendor {
  id: number;
  name: string;
}

interface GetVendor extends RowDataPacket, Vendor {}

type PostVendor = Omit<Vendor, 'id'>;

type PutVendor = Partial<PostVendor>;

export { Vendor, GetVendor, PostVendor, PutVendor };
