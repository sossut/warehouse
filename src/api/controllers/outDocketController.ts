import { validationResult } from 'express-validator';

import {
  getAllOutDockets,
  getOutDocket,
  postOutDocket,
  putOutDocket,
  deleteOutDocket
} from '../models/outDocketModel';

import { Request, Response, NextFunction } from 'express';

import { PostOutDocket, PutOutDocket } from '../../interfaces/OutDocket';
import CustomError from '../../classes/CustomError';
import MessageResponse from '../../interfaces/MessageResponse';
import { User } from '../../interfaces/User';
import { OutDocketProduct } from '../../interfaces/OutDocketProduct';
import {
  getOutDocketProduct,
  postOutDocketProduct,
  putOutDocketProduct
} from '../models/outDocketProductModel';
import { postProductHistoryLeaveManual } from '../models/productHistoryModel';
import { getProduct, putProduct } from '../models/productModel';

const outDocketListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const OutDockets = await getAllOutDockets();
    res.json(OutDockets);
  } catch (error) {
    next(error);
  }
};

const outDocketGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const OutDocket = await getOutDocket(req.params.id);
    res.json(OutDocket);
  } catch (error) {
    next(error);
  }
};

const outDocketPost = async (
  req: Request<{}, {}, PostOutDocket>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => {
          console.log(error);
          if (error.type === 'field') {
            return `${error.msg}: ${error.path}`;
          }
        })
        .join(', ');
      throw new CustomError(messages, 400);
    }

    req.body.userId = (req.user as User).id;

    const id = await postOutDocket(req.body);
    const products = req.body.products;
    if (id) {
      if (products) {
        for (const product of products) {
          let quantity = product.orderedProductQuantity;
          if (!quantity) {
            quantity = 0;
          }
          const dp: OutDocketProduct = {
            outDocketId: id,
            productId: product.productId,
            orderedProductQuantity: quantity,
            deliveredProductQuantity: product.deliveredProductQuantity
          };
          await postOutDocketProduct(dp);
        }
      }
    }
    const message: MessageResponse = {
      message: 'OutDocket created',
      id: id
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

const outDocketPut = async (
  req: Request<{ id: string }, {}, PutOutDocket>,
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
    const products = req.body.products;

    if (products) {
      for (const product of products) {
        console.log({ product });
        let quantity = product.orderedProductQuantity;
        if (!quantity) {
          quantity = 0;
        }
        let id = product.id as number;
        if (!id) {
          id = product.productId as number;
        }
        try {
          console.log({ productid: product.id }, { docketid: req.params.id });
          if (!product.outDocketProductId) {
            throw new CustomError('OutDocketProduct not found', 404);
          }
          const oldOutDocketProduct = await getOutDocketProduct(
            product.outDocketProductId?.toString()
          );
          try {
            const oldQuantity = oldOutDocketProduct.deliveredProductQuantity;
            const newQuantity = product.deliveredProductQuantity;
            const p = await getProduct(id.toString());
            const oldProductQuantity = p.quantity;
            console.log(
              { oldQuantity },
              { newQuantity },
              { oldProductQuantity },
              { id }
            );
            if (newQuantity && oldQuantity < newQuantity) {
              await postProductHistoryLeaveManual({
                productId: id,
                quantity: -(newQuantity - oldQuantity),
                outDocketId: parseInt(req.params.id),
                manual: 'yes'
              });
              await putProduct(
                { quantity: oldProductQuantity - (newQuantity - oldQuantity) },
                id
              );
            } else if (newQuantity && oldQuantity > newQuantity) {
              await postProductHistoryLeaveManual({
                productId: id,
                quantity: oldQuantity - newQuantity,
                outDocketId: parseInt(req.params.id),
                manual: 'yes'
              });
              await putProduct(
                { quantity: oldProductQuantity + (oldQuantity - newQuantity) },
                id
              );
            }
          } catch (error) {
            console.log(error);
          }
          const dp: OutDocketProduct = {
            outDocketId: parseInt(req.params.id),
            productId: id,
            orderedProductQuantity: quantity,
            deliveredProductQuantity: product.deliveredProductQuantity
          };
          if (oldOutDocketProduct.id) {
            await putOutDocketProduct(dp, oldOutDocketProduct.id);
          }
        } catch (error) {
          const dp: OutDocketProduct = {
            outDocketId: parseInt(req.params.id),
            productId: id,
            orderedProductQuantity: quantity,
            deliveredProductQuantity: product.deliveredProductQuantity
          };
          await postOutDocketProduct(dp);
        }
      }
    }
    delete req.body.products;
    req.body.updatedAt = new Date();
    if (req.body.departureAt !== null && req.body.departureAt !== undefined) {
      req.body.departureAt = new Date(
        new Date(req.body.departureAt)
          .toISOString()
          .slice(0, 19)
          .replace('T', ' ')
      );
    }

    const result = await putOutDocket(req.body, parseInt(req.params.id));
    if (!result) {
      throw new CustomError('OutDocket not updated', 400);
    }
    // const message: MessageResponse = {
    //   message: 'OutDocket updated',
    //   id: parseInt(req.params.id)
    // };
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const outDocketDelete = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const outDocket = await getOutDocket(req.params.id);

    if (outDocket.products && outDocket.products.length > 0) {
      for (const product of outDocket.products) {
        const prod = await getProduct(product.id?.toString() as string);
        await putProduct(
          { quantity: prod.quantity + product.deliveredProductQuantity },
          product.id as number
        );
      }
    }
    const result = await deleteOutDocket(parseInt(req.params.id));
    if (!result) {
      throw new CustomError('OutDocket not deleted', 400);
    }
    const message: MessageResponse = {
      message: 'OutDocket deleted',
      id: parseInt(req.params.id)
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

export {
  outDocketListGet,
  outDocketGet,
  outDocketPost,
  outDocketPut,
  outDocketDelete
};
