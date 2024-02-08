import { validationResult } from 'express-validator';

import {
  getAllProductSubCategories,
  getProductSubCategory,
  postProductSubCategory,
  putProductSubCategory,
  deleteProductSubCategory
} from '../models/productSubCategoryModel';

import { Request, Response, NextFunction } from 'express';
import {
  PostProductSubCategory,
  PutProductSubCategory
} from '../../interfaces/ProductSubCategory';
import CustomError from '../../classes/CustomError';
import MessageResponse from '../../interfaces/MessageResponse';

const productSubCategoryListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productSubCategories = await getAllProductSubCategories();
    res.json(productSubCategories);
  } catch (error) {
    next(error);
  }
};

const productSubCategoryGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const productSubCategory = await getProductSubCategory(req.params.id);
    res.json(productSubCategory);
  } catch (error) {
    next(error);
  }
};

const productSubCategoryPost = async (
  req: Request<{}, {}, PostProductSubCategory>,
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

    const id = await postProductSubCategory(req.body);
    if (id) {
      const message: MessageResponse = {
        message: 'Product Sub Category created',
        id
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

const productSubCategoryPut = async (
  req: Request<{ id: string }, {}, PutProductSubCategory>,
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
    const productSubCategory = await putProductSubCategory(
      req.body,
      parseInt(req.params.id)
    );
    if (productSubCategory) {
      const message: MessageResponse = {
        message: 'Product Sub Category updated',
        id: parseInt(req.params.id)
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

const productSubCategoryDelete = async (
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
    const productSubCategory = await deleteProductSubCategory(
      parseInt(req.params.id)
    );
    if (productSubCategory) {
      const message: MessageResponse = {
        message: 'Product Sub Category deleted',
        id: parseInt(req.params.id)
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

export {
  productSubCategoryListGet,
  productSubCategoryGet,
  productSubCategoryPost,
  productSubCategoryPut,
  productSubCategoryDelete
};
