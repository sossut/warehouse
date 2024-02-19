import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import {
  getAllSentOutDockets,
  getSentOutDocket,
  postSentOutDocket,
  putSentOutDocket,
  deleteSentOutDocket
} from '../models/sentOutDocketModel';
import CustomError from '../../classes/CustomError';
import {
  PostSentOutDocket,
  PutSentOutDocket
} from '../../interfaces/SentOutDocket';

const sentOutDocketListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sentOutDockets = await getAllSentOutDockets();
    if (sentOutDockets.length === 0) {
      throw new CustomError('No sentOutDockets found', 404);
    }
    res.json(sentOutDockets);
  } catch (error) {
    next(error);
  }
};

const sentOutDocketGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const sentOutDocket = await getSentOutDocket(req.params.id);
    if (!sentOutDocket) {
      throw new CustomError('SentOutDocket not found', 404);
    }
    res.json(sentOutDocket);
  } catch (error) {
    next(error);
  }
};

const sentOutDocketPost = async (
  req: Request<{}, {}, PostSentOutDocket>,
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
          return error.msg;
        })
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const sentOutDocket = await postSentOutDocket(req.body);
    res.json(sentOutDocket);
  } catch (error) {
    next(error);
  }
};

const sentOutDocketPut = async (
  req: Request<{ id: string }, {}, PutSentOutDocket>,
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
          return error.msg;
        })
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const sentOutDocket = await putSentOutDocket(req.params.id, req.body);
    res.json(sentOutDocket);
  } catch (error) {
    next(error);
  }
};

const sentOutDocketDelete = async (
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
          return error.msg;
        })
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const sentOutDocket = await deleteSentOutDocket(req.params.id);
    res.json(sentOutDocket);
  } catch (error) {
    next(error);
  }
};

export {
  sentOutDocketListGet,
  sentOutDocketGet,
  sentOutDocketPost,
  sentOutDocketPut,
  sentOutDocketDelete
};
