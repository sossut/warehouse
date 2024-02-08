import { validationResult } from 'express-validator';

import {
  getAllProductCategories,
  getProductCategory,
  postProductCategory,
  putProductCategory,
  deleteProductCategory
} from '../models/productCategoryModel';

import { Request, Response, NextFunction } from 'express';
import {
  PostProductCategory,
  PutProductCategory
} from '../../interfaces/ProductCategory';
import CustomError from '../../classes/CustomError';
import MessageResponse from '../../interfaces/MessageResponse';

const productCategoryListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productCategories = await getAllProductCategories();
    res.json(productCategories);
  } catch (error) {
    next(error);
  }
};

const productCategoryGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const productCategory = await getProductCategory(req.params.id);
    res.json(productCategory);
  } catch (error) {
    next(error);
  }
};

const productCategoryPost = async (
  req: Request<{}, {}, PostProductCategory>,
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
    const id = await postProductCategory(req.body);
    const message: MessageResponse = {
      message: 'ProductCategory created',
      id
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

const productCategoryPut = async (
  req: Request<{ id: string }, {}, PutProductCategory>,
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
    await putProductCategory(req.body, parseInt(req.params.id));
    const message: MessageResponse = {
      message: 'ProductCategory updated',
      id: parseInt(req.params.id)
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

const productCategoryDelete = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteProductCategory(parseInt(req.params.id));
    const message: MessageResponse = {
      message: 'ProductCategory deleted',
      id: parseInt(req.params.id)
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

export {
  productCategoryListGet,
  productCategoryGet,
  productCategoryPost,
  productCategoryPut,
  productCategoryDelete
};
