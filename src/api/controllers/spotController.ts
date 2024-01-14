import { validationResult } from 'express-validator';

import {
  postSpot,
  deleteSpot,
  putSpot,
  getAllSpots,
  getSpot
} from '../models/spotModel';
import { Request, Response, NextFunction } from 'express';

import { PostSpot, PutSpot } from '../../interfaces/Spot';
import CustomError from '../../classes/CustomError';
import MessageResponse from '../../interfaces/MessageResponse';
import { Row } from '../../interfaces/Row';
import { postRow } from '../models/rowModel';
import { postGap } from '../models/gapModel';

const spotListGet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const spots = await getAllSpots();
    if (spots.length === 0) {
      throw new CustomError('No spots found', 404);
    }
    res.json(spots);
  } catch (error) {
    next(error);
  }
};

const spotGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const spot = await getSpot(req.params.id);
    if (!spot) {
      throw new CustomError('Spot not found', 404);
    }
    res.json(spot);
  } catch (error) {
    next(error);
  }
};

const spotPost = async (
  req: Request<{}, {}, PostSpot>,
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
    const spotId = await postSpot(req.body);
    if (!spotId) {
      throw new CustomError('Spot not created', 400);
    }
    const message: MessageResponse = {
      message: 'Spot created',
      id: spotId
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

const spotGapRowPost = async (
  req: Request<{}, {}, PostSpot>,
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
    const data = req.body.data as Row[];

    for (const row of data) {
      const rowId = await postRow(row);
      if (row.data) {
        for (const gap of row.data) {
          gap.rowId = rowId;
          const gapId = await postGap(gap);
          if (gap.data) {
            for (const spot of gap.data) {
              spot.gapId = gapId;
              await postSpot(spot);
            }
          }
        }
      }
    }

    const message: MessageResponse = {
      message: 'Rows, Gaps and Spots created'
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

const spotPut = async (
  req: Request<{ id: string }, {}, PutSpot>,
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
    const result = await putSpot(req.body, parseInt(req.params.id));
    if (!result) {
      throw new CustomError('Spot not updated', 400);
    }
    const message: MessageResponse = {
      message: 'Spot updated',
      id: parseInt(req.params.id)
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

const spotDelete = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await deleteSpot(parseInt(req.params.id));
    if (!result) {
      throw new CustomError('Spot not deleted', 400);
    }
    const message: MessageResponse = {
      message: 'Spot deleted',
      id: parseInt(req.params.id)
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

export { spotListGet, spotGet, spotPost, spotGapRowPost, spotPut, spotDelete };
