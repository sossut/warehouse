import { validationResult } from 'express-validator';

import {
  getAllTransportOptions,
  getTransportOption,
  postTransportOption,
  putTransportOption,
  deleteTransportOption
} from '../models/transportOptionModel';

import { Request, Response, NextFunction } from 'express';

import {
  TransportOption,
  PostTransportOption
} from '../../interfaces/TransportOption';
import CustomError from '../../classes/CustomError';
import MessageResponse from '../../interfaces/MessageResponse';

const transportOptionListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transportOptions = await getAllTransportOptions();
    res.json(transportOptions);
  } catch (error) {
    next(error);
  }
};

const transportOptionGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const transportOption = await getTransportOption(req.params.id);
    res.json(transportOption);
  } catch (error) {
    next(error);
  }
};

const transportOptionPost = async (
  req: Request<{}, {}, PostTransportOption>,
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
    const tramsportOption = await postTransportOption(req.body);
    const message: MessageResponse = {
      message: 'TransportOption created',
      id: tramsportOption
    };
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

const transportOptionPut = async (
  req: Request<{ id: string }, {}, TransportOption>,
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
    const tramsportOption = await putTransportOption(
      req.body,
      parseInt(req.params.id)
    );
    if (tramsportOption) {
      const message: MessageResponse = {
        message: 'TransportOption updated',
        id: parseInt(req.params.id)
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

const transportOptionDelete = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await deleteTransportOption(parseInt(req.params.id));
    if (result) {
      const message: MessageResponse = {
        message: 'TransportOption deleted',
        id: parseInt(req.params.id)
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

export {
  transportOptionListGet,
  transportOptionGet,
  transportOptionPost,
  transportOptionPut,
  transportOptionDelete
};
