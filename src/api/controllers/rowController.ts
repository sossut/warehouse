import { validationResult } from 'express-validator';

import {
  getAllRows,
  getRow,
  postRow,
  putRow,
  deleteRow,
  getAllRowsGapsSpots
} from '../models/rowModel';

import { Request, Response, NextFunction } from 'express';
import { PostRow, PutRow } from '../../interfaces/Row';

import CustomError from '../../classes/CustomError';
import MessageResponse from '../../interfaces/MessageResponse';

const rowListGet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await getAllRows();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

const rowListGetGapsSpots = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const rows = await getAllRowsGapsSpots();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

const rowGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const row = await getRow(req.params.id);
    res.json(row);
  } catch (error) {
    next(error);
  }
};

const rowPost = async (
  req: Request<{}, {}, PostRow>,
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
    const id = await postRow(req.body);
    const message: MessageResponse = {
      message: 'Row created',
      id
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

const rowPut = async (
  req: Request<{ id: string }, {}, PutRow>,
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
    const result = await putRow(req.body, parseInt(req.params.id));
    if (result) {
      const message: MessageResponse = {
        message: 'Row updated',
        id: parseInt(req.params.id)
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

const rowDelete = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await deleteRow(parseInt(req.params.id));
    if (result) {
      const message: MessageResponse = {
        message: 'Row deleted',
        id: parseInt(req.params.id)
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

export { rowListGet, rowListGetGapsSpots, rowGet, rowPost, rowPut, rowDelete };
