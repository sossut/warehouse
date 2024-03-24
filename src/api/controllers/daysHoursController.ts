import { validationResult } from 'express-validator';

import { Request, Response, NextFunction } from 'express';

import CustomError from '../../classes/CustomError';
import MessageResponse from '../../interfaces/MessageResponse';

import {
  getAllDaysHours,
  getDaysHours,
  postDaysHours,
  putDaysHours,
  deleteDaysHours
} from '../models/daysHoursModel';

import { DaysHours } from '../../interfaces/DaysHours';

const daysHoursListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const daysHours = await getAllDaysHours();
    res.json(daysHours);
  } catch (error) {
    next(error);
  }
};

const daysHoursGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const daysHours = await getDaysHours(req.params.id);
    res.json(daysHours);
  } catch (error) {
    next(error);
  }
};

const daysHoursPost = async (
  req: Request<{}, {}, DaysHours>,
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

    const daysHours = await postDaysHours(req.body);
    const message: MessageResponse = {
      message: 'DaysHours created',
      id: daysHours
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

const daysHoursPut = async (
  req: Request<{ id: string }, {}, DaysHours>,
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

    const daysHours = await putDaysHours(req.params.id, req.body);
    res.json(daysHours);
  } catch (error) {
    next(error);
  }
};

const daysHoursDelete = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const daysHours = await deleteDaysHours(req.params.id);
    res.json(daysHours);
  } catch (error) {
    next(error);
  }
};

export {
  daysHoursListGet,
  daysHoursGet,
  daysHoursPost,
  daysHoursPut,
  daysHoursDelete
};
