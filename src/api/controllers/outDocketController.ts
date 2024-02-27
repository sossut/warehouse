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
  deleteOutDocketProductByOutDocketId,
  postOutDocketProduct
} from '../models/outDocketProductModel';

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
      try {
        await deleteOutDocketProductByOutDocketId(parseInt(req.params.id));
      } catch (error) {}

      for (const product of products) {
        let quantity = product.orderedProductQuantity;
        if (!quantity) {
          quantity = 0;
        }
        let id = product.id as number;
        if (!id) {
          id = product.productId as number;
        }
        console.log('product', product);
        const dp: OutDocketProduct = {
          outDocketId: parseInt(req.params.id),
          productId: id,
          orderedProductQuantity: quantity,
          deliveredProductQuantity: product.deliveredProductQuantity
        };
        console.log('dp', dp);
        await postOutDocketProduct(dp);
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
