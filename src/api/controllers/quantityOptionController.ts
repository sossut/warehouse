import { validationResult } from 'express-validator';

import {
  getAllQuantityOptions,
  getQuantityOption,
  postQuantityOption,
  putQuantityOption,
  deleteQuantityOption
} from '../models/quantityOptionModel';

import { Request, Response, NextFunction } from 'express';

import {
  QuantityOption,
  PostQuantityOption
} from '../../interfaces/QuantityOption';
import CustomError from '../../classes/CustomError';
import MessageResponse from '../../interfaces/MessageResponse';

const quantityOptionListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const quantityOptions = await getAllQuantityOptions();
    res.json(quantityOptions);
  } catch (error) {
    next(error);
  }
};

const quantityOptionGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const quantityOption = await getQuantityOption(req.params.id);
    res.json(quantityOption);
  } catch (error) {
    next(error);
  }
};

const quantityOptionPost = async (
  req: Request<{}, {}, PostQuantityOption>,
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
    const quantityOption = await postQuantityOption(req.body);
    if (quantityOption) {
      const message: MessageResponse = {
        message: 'QuantityOption created',
        id: quantityOption
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

const quantityOptionPut = async (
  req: Request<{ id: string }, {}, QuantityOption>,
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
    const quantityOption = await putQuantityOption(
      req.body,
      parseInt(req.params.id)
    );
    if (quantityOption) {
      const message: MessageResponse = {
        message: 'QuantityOption updated',
        id: parseInt(req.params.id)
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

const quantityOptionDelete = async (
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
    const quantityOption = await deleteQuantityOption(parseInt(req.params.id));
    if (quantityOption) {
      const message: MessageResponse = {
        message: 'QuantityOption deleted',
        id: parseInt(req.params.id)
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

export {
  quantityOptionListGet,
  quantityOptionGet,
  quantityOptionPost,
  quantityOptionPut,
  quantityOptionDelete
};
