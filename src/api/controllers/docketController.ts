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
    const docket = await postDocket(req.body);
    const message: MessageResponse = {
      message: 'Docket created',
      id: docket
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
