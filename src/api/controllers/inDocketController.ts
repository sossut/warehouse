import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

import CustomError from '../../classes/CustomError';
import MessageResponse from '../../interfaces/MessageResponse';

import {
  getAllInDockets,
  getInDocket,
  postInDocket,
  putInDocket,
  deleteInDocket
} from '../models/inDocketModel';

import { PostInDocket, PutInDocket } from '../../interfaces/InDocket';
import { postInDocketProduct } from '../models/inDocketProductModel';
import { InDocketProduct } from '../../interfaces/InDocketProduct';
import { User } from '../../interfaces/User';
import { getProduct, putProduct } from '../models/productModel';
import { postProductHistoryArrive } from '../models/productHistoryModel';

const inDocketListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const inDockets = await getAllInDockets();
    if (inDockets.length === 0) {
      throw new CustomError('No inDockets found', 404);
    }
    res.json(inDockets);
  } catch (error) {
    next(error);
  }
};

const inDocketGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const inDocket = await getInDocket(req.params.id);
    if (!inDocket) {
      throw new CustomError('InDocket not found', 404);
    }
    res.json(inDocket);
  } catch (error) {
    next(error);
  }
};

const inDocketPost = async (
  req: Request<{}, {}, PostInDocket>,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body);
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
      console.log(messages);
      throw new CustomError(messages, 400);
    }
    req.body.userId = (req.user as User).id;
    const id = await postInDocket(req.body);
    const products = req.body.products;
    if (products) {
      for (const product of products) {
        let orderedQ = product.orderedProductQuantity;
        if (!orderedQ) {
          orderedQ = 0;
        }
        const dp: InDocketProduct = {
          inDocketId: id,
          productId: product.productId,
          orderedProductQuantity: orderedQ,
          receivedProductQuantity: product.receivedProductQuantity
        };
        await postInDocketProduct(dp);
        const prod = await getProduct(product.productId.toString());
        if (product.receivedProductQuantity > 0) {
          await postProductHistoryArrive({
            productId: product.productId,
            quantity: product.receivedProductQuantity,
            inDocketId: id
          });
          const quantity =
            Number(prod.quantity) + Number(product.receivedProductQuantity);

          await putProduct({ quantity }, product.productId as number);
        }
      }
    }
    const message: MessageResponse = {
      message: 'InDocket created',
      id
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

const inDocketPut = async (
  req: Request<{ id: string }, {}, PutInDocket>,
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
      console.log(messages);
      throw new CustomError(messages, 400);
    }
    const inDocket = await putInDocket(req.body, parseInt(req.params.id));
    if (!inDocket) {
      const message: MessageResponse = {
        message: 'InDocket updated',
        id: parseInt(req.params.id)
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

const inDocketDelete = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const inDocket = await deleteInDocket(parseInt(req.params.id));
    res.json(inDocket);
  } catch (error) {
    next(error);
  }
};

export {
  inDocketListGet,
  inDocketGet,
  inDocketPost,
  inDocketPut,
  inDocketDelete
};
