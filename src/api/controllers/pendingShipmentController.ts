import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import CustomError from '../../classes/CustomError';
import MessageResponse from '../../interfaces/MessageResponse';
import {
  getAllPendingShipments,
  getPendingShipment,
  postPendingShipment,
  putPendingShipment,
  deletePendingShipment
} from '../models/pendingShipmentModel';
import {
  PostPendingShipment,
  PutPendingShipment
} from '../../interfaces/PendingShipment';
import { User } from '../../interfaces/User';
import { postPendingShipmentProduct } from '../models/pendingShipmentProductModel';
import { PendingShipmentProduct } from '../../interfaces/PendingShipmentProduct';
import { getOutDocketProduct } from '../models/outDocketProductModel';

const pendingShipmentListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pendingShipments = await getAllPendingShipments();
    if (pendingShipments.length === 0) {
      throw new CustomError('No pendingShipments found', 404);
    }
    res.json(pendingShipments);
  } catch (error) {
    next(error);
  }
};

const pendingShipmentGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const pendingShipment = await getPendingShipment(req.params.id);
    if (!pendingShipment) {
      throw new CustomError('PendingShipment not found', 404);
    }
    res.json(pendingShipment);
  } catch (error) {
    next(error);
  }
};

const pendingShipmentPost = async (
  req: Request<{}, {}, PostPendingShipment>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => {
          if (error.type === 'field') {
            return error.msg;
          }
          return error.msg;
        })
        .join(', ');
      throw new CustomError(messages, 400);
    }
    req.body.departureAt = new Date(
      new Date(req.body.departureAt)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ')
    );
    if (!req.body.departureAt) {
      req.body.departureAt = new Date();
    }
    req.body.userId = (req.user as User).id;
    const id = await postPendingShipment(req.body);
    const products = req.body.products;
    if (id && products) {
      for (const product of products) {
        console.log(product);
        const productId = product.productId;
        const orderedProductQuantity = product.orderedProductQuantity;
        const pendingShipmentId = id;
        let deliveredProductQuantity = product.deliveredProductQuantity;
        if (!deliveredProductQuantity || deliveredProductQuantity < 0) {
          deliveredProductQuantity = 0;
        }
        const pendingShipmentProduct: PendingShipmentProduct = {
          productId: productId as number,
          orderedProductQuantity: orderedProductQuantity,
          pendingShipmentId: pendingShipmentId,
          deliveredProductQuantity: deliveredProductQuantity
        };
        if (!product.outDocketProductId) {
          throw new CustomError('sentOutDocketProductId not found', 404);
        }
        const outDocketProduct = await getOutDocketProduct(
          product.outDocketProductId?.toString()
        );
        pendingShipmentProduct.orderedProductQuantity =
          outDocketProduct.orderedProductQuantity;
        console.log(pendingShipmentProduct);
        await postPendingShipmentProduct(pendingShipmentProduct);
      }
    }
    const message: MessageResponse = {
      message: 'PendingShipment created',
      id
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

const pendingShipmentPut = async (
  req: Request<{ id: string }, {}, PutPendingShipment>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => {
          if (error.type === 'field') {
            return error.msg;
          }
          return error.msg;
        })
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const pendingShipment = await putPendingShipment(req.params.id, req.body);
    res.json(pendingShipment);
  } catch (error) {
    next(error);
  }
};

const pendingShipmentDelete = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const pendingShipment = await deletePendingShipment(req.params.id);
    res.json(pendingShipment);
  } catch (error) {
    next(error);
  }
};

export {
  pendingShipmentListGet,
  pendingShipmentGet,
  pendingShipmentPost,
  pendingShipmentPut,
  pendingShipmentDelete
};
