import { validationResult } from 'express-validator';
import {
  postGap,
  deleteGap,
  putGap,
  getAllGaps,
  getGap
} from '../models/gapModel';

import { Request, Response, NextFunction } from 'express';
import { PostGap, PutGap } from '../../interfaces/Gap';

import CustomError from '../../classes/CustomError';
import MessageResponse from '../../interfaces/MessageResponse';

const gapListGet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const gaps = await getAllGaps();
    if (gaps.length === 0) {
      throw new CustomError('No gaps found', 404);
    }
    res.json(gaps);
  } catch (error) {
    next(error);
  }
};

const gapGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const gap = await getGap(req.params.id);
    if (!gap) {
      throw new CustomError('Gap not found', 404);
    }
    res.json(gap);
  } catch (error) {
    next(error);
  }
};

const gapPost = async (
  req: Request<{}, {}, PostGap>,
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
    const id = await postGap(req.body);
    if (!id) {
      throw new CustomError('Gap not created', 400);
    }
    const message: MessageResponse = {
      message: 'Gap created',
      id: id
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

const gapPut = async (
  req: Request<{ id: string }, {}, PutGap>,
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
    const result = await putGap(req.body, parseInt(req.params.id));
    if (!result) {
      throw new CustomError('Gap not updated', 400);
    }
    const message: MessageResponse = {
      message: 'Gap updated',
      id: parseInt(req.params.id)
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

const gapDelete = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await deleteGap(parseInt(req.params.id));
    if (!result) {
      throw new CustomError('Gap not deleted', 400);
    }
    const message: MessageResponse = {
      message: 'Gap deleted',
      id: parseInt(req.params.id)
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

export { gapListGet, gapGet, gapPost, gapPut, gapDelete };
