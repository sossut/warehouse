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
    const inDocket = await postInDocket(req.body);
    res.json(inDocket);
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
