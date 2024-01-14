import { validationResult } from 'express-validator';

import {
  getAllDockets,
  getDocket,
  postDocket,
  putDocket,
  deleteDocket
} from '../models/docketModel';

import { Request, Response, NextFunction } from 'express';

import { PostDocket, PutDocket } from '../../interfaces/Docket';
import CustomError from '../../classes/CustomError';
import MessageResponse from '../../interfaces/MessageResponse';
import { User } from '../../interfaces/User';
import { DocketProduct } from '../../interfaces/DocketProduct';
import {
  deleteDocketProductByDocketId,
  postDocketProduct
} from '../models/docketProductModel';

const docketListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dockets = await getAllDockets();
    res.json(dockets);
  } catch (error) {
    next(error);
  }
};

const docketGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const docket = await getDocket(req.params.id);
    res.json(docket);
  } catch (error) {
    next(error);
  }
};

const docketPost = async (
  req: Request<{}, {}, PostDocket>,
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

    const id = await postDocket(req.body);
    const products = req.body.products;
    if (id) {
      if (products) {
        for (const product of products) {
          let quantity = product.productQuantity;
          if (!quantity) {
            quantity = 0;
          }
          const dp: DocketProduct = {
            docketId: id,
            productId: product.productId,
            productQuantity: quantity,
            quantityOptionId: product.quantityOptionId
          };
          await postDocketProduct(dp);
        }
      }
    }
    const message: MessageResponse = {
      message: 'Docket created',
      id: id
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

const docketPut = async (
  req: Request<{ id: string }, {}, PutDocket>,
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
        await deleteDocketProductByDocketId(parseInt(req.params.id));
      } catch (error) {}

      for (const product of products) {
        let quantity = product.productQuantity;
        if (!quantity) {
          quantity = 0;
        }
        const dp: DocketProduct = {
          docketId: parseInt(req.params.id),
          productId: product.productId,
          productQuantity: quantity,
          quantityOptionId: product.quantityOptionId
        };
        await postDocketProduct(dp);
      }
    }
    delete req.body.products;
    req.body.updatedAt = new Date();
    const result = await putDocket(req.body, parseInt(req.params.id));
    if (!result) {
      throw new CustomError('Docket not updated', 400);
    }
    const message: MessageResponse = {
      message: 'Docket updated',
      id: parseInt(req.params.id)
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

const docketDelete = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await deleteDocket(parseInt(req.params.id));
    if (!result) {
      throw new CustomError('Docket not deleted', 400);
    }
    const message: MessageResponse = {
      message: 'Docket deleted',
      id: parseInt(req.params.id)
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

export { docketListGet, docketGet, docketPost, docketPut, docketDelete };
