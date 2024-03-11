import { RowDataPacket } from 'mysql2';
import { PendingShipment } from './PendingShipment';
import { Product } from './Product';

interface PendingShipmentProduct {
  id?: number;
  pendingShipmentId: number | PendingShipment;
  productId: number | Product;
  orderedProductQuantity?: number;
  deliveredProductQuantity: number;
  outDocketProductId?: number;
}

interface GetPendingShipmentProduct
  extends RowDataPacket,
    PendingShipmentProduct {}

type PostPendingShipmentProduct = Omit<PendingShipmentProduct, 'id'>;

type PutPendingShipmentProduct = Partial<PostPendingShipmentProduct>;

export {
  PendingShipmentProduct,
  GetPendingShipmentProduct,
  PostPendingShipmentProduct,
  PutPendingShipmentProduct
};
