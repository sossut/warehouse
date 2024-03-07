import { validationResult } from 'express-validator';

import {
  getAllProducts,
  getProduct,
  postProduct,
  putProduct,
  deleteProduct,
  getProductByCode
} from '../models/productModel';

import { Request, Response, NextFunction } from 'express';
import { PostProduct, PutProduct } from '../../interfaces/Product';

import CustomError from '../../classes/CustomError';
import MessageResponse from '../../interfaces/MessageResponse';
import {
  getProductHistoryByProductId,
  postProductHistoryManual
} from '../models/productHistoryModel';

const productListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const productGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await getProduct(req.params.id);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const productGetByCode = async (
  req: Request<{ code: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await getProductByCode(req.params.code);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const productPost = async (
  req: Request<{}, {}, PostProduct>,
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
    req.body.updatedAt = new Date();
    const result = await postProduct(req.body);
    if (result) {
      const message: MessageResponse = {
        message: 'Product created',
        id: result
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

const productPut = async (
  req: Request<{ id: string }, {}, PutProduct>,
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

    req.body.updatedAt = new Date();
    const product = req.body;
    const result = await putProduct(product, parseInt(req.params.id));
    if (result) {
      const oldProduct = await getProduct(req.params.id);
      const oldQuantity = oldProduct.quantity;
      const newQuantity = req.body.quantity;
      if (newQuantity && oldQuantity < newQuantity) {
        await postProductHistoryManual({
          productId: parseInt(req.params.id),
          quantity: newQuantity - oldQuantity,
          manual: 'yes'
        });
      } else if (newQuantity && oldQuantity > newQuantity) {
        await postProductHistoryManual({
          productId: parseInt(req.params.id),
          quantity: oldQuantity - newQuantity,
          manual: 'yes'
        });
      }
      // const message: MessageResponse = {
      //   message: 'Product updated',
      //   id: parseInt(req.params.id)
      // };
      res.json(result);
    }
  } catch (error) {
    next(error);
  }
};

const productDelete = async (
  req: Request<{ id: string }, {}, {}>,
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
    const result = await deleteProduct(parseInt(req.params.id));
    if (result) {
      const message: MessageResponse = {
        message: 'Product deleted',
        id: parseInt(req.params.id)
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

const productHistoryGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await getProductHistoryByProductId(parseInt(req.params.id));
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export {
  productListGet,
  productGet,
  productGetByCode,
  productPost,
  productPut,
  productDelete,
  productHistoryGet
};
