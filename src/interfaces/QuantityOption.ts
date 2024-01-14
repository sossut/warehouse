import { RowDataPacket } from 'mysql2';

interface QuantityOption {
  id: number;
  quantityOption: string;
}

interface GetQuantityOption extends RowDataPacket, QuantityOption {}

type PostQuantityOption = Omit<QuantityOption, 'id'>;

type PutQuantityOption = Partial<PostQuantityOption>;

export {
  QuantityOption,
  GetQuantityOption,
  PostQuantityOption,
  PutQuantityOption
};
