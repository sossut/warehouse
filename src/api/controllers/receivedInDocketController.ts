import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import CustomError from '../../classes/CustomError';
import MessageResponse from '../../interfaces/MessageResponse';

import {
  getAllReceivedInDockets,
  getReceivedInDocket,
  postReceivedInDocket,
  putReceivedInDocket,
  deleteReceivedInDocket
} from '../models/receivedInDocketModel';

import { ReceivedInDocket } from '../../interfaces/ReceivedInDocket';
import { postReceivedInDocketProduct } from '../models/receivedInDocketProductModel';
import { getProduct, putProduct } from '../models/productModel';
import { getInDocketProduct } from '../models/inDocketProductModel';
import { postProductHistoryArrive } from '../models/productHistoryModel';

const receivedInDocketListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const receivedInDockets = await getAllReceivedInDockets();
    res.json(receivedInDockets);
  } catch (error) {
    next(error);
  }
};

const receivedInDocketGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const receivedInDocket = await getReceivedInDocket(req.params.id);
    res.json(receivedInDocket);
  } catch (error) {
    next(error);
  }
};

const receivedInDocketPost = async (
  req: Request<{}, {}, ReceivedInDocket>,
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
            return `${error.msg}: ${error.path}`;
          }
        })
        .join(', ');

      throw new CustomError(messages, 400);
    }

    const receivedInDocket = await postReceivedInDocket(req.body);

    const products = req.body.products;
    if (receivedInDocket) {
      if (products) {
        for (const product of products) {
          let ordered = product.orderedProductQuantity;
          if (ordered < 0) {
            ordered = 0;
          }
          let received = product.receivedProductQuantity;
          if (received < 0) {
            received = 0;
          }
          const receivedInDocketProduct = {
            receivedInDocketId: receivedInDocket,
            productId: product.productId,
            orderedProductQuantity: ordered,
            receivedProductQuantity: received
          };
          if (!product.inDocketProductId) {
            throw new CustomError('inDocketProductId is required', 400);
          }
          await postReceivedInDocketProduct(receivedInDocketProduct);
          const inDocketProduct = await getInDocketProduct(
            product.inDocketProductId.toString()
          );
          const prod = await getProduct(product.productId.toString());
          if (
            product.receivedProductQuantity > 0 &&
            product.receivedProductQuantity !==
              inDocketProduct.receivedProductQuantity
          ) {
            await postProductHistoryArrive({
              productId: product.productId,
              quantity: product.receivedProductQuantity,
              inDocketId: inDocketProduct.inDocketId
            });
          }
          const quantity = prod.quantity + product.receivedProductQuantity;
          await putProduct({ quantity }, product.productId as number);
        }
      }
    }
    const message: MessageResponse = {
      message: 'ReceivedInDocket created',
      id: receivedInDocket
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

const receivedInDocketPut = async (
  req: Request<{ id: string }, {}, ReceivedInDocket>,
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
            return `${error.msg}: ${error.path}`;
          }
        })
        .join(', ');

      throw new CustomError(messages, 400);
    }
    const receivedInDocket = await putReceivedInDocket(req.params.id, req.body);
    res.json(receivedInDocket);
  } catch (error) {
    next(error);
  }
};

const receivedInDocketDelete = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const receivedInDocket = await deleteReceivedInDocket(req.params.id);
    res.json(receivedInDocket);
  } catch (error) {
    next(error);
  }
};

export {
  receivedInDocketListGet,
  receivedInDocketGet,
  receivedInDocketPost,
  receivedInDocketPut,
  receivedInDocketDelete
};
