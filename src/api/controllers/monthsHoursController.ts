import { validationResult } from 'express-validator';

import { Request, Response, NextFunction } from 'express';

import CustomError from '../../classes/CustomError';
import MessageResponse from '../../interfaces/MessageResponse';
import { MonthsHours } from '../../interfaces/MonthsHours';
import {
  getAllMonthsHours,
  getMonthsHours,
  postMonthsHours,
  putMonthsHours,
  deleteMonthsHours
} from '../models/monthsHoursModel';
import { postMonthsHoursDaysHours } from '../models/monthsHoursDaysHoursModel';
import { getDaysHoursBetweenDates } from '../models/daysHoursModel';

const monthsHoursListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const monthsHours = await getAllMonthsHours();
    res.json(monthsHours);
  } catch (error) {
    next(error);
  }
};

const monthsHoursGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const monthsHours = await getMonthsHours(req.params.id);
    res.json(monthsHours);
  } catch (error) {
    next(error);
  }
};

const monthsHoursPost = async (
  req: Request<{}, {}, MonthsHours>,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

    const id = await postMonthsHours(req.body);
    const formatDate = (date: Date, upOrDown: boolean) => {
      const datePart = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
        .map((n, i) => n.toString().padStart(i === 2 ? 4 : 2, '0'))
        .join('-');
      const timePart = [
        date.getHours() + (upOrDown ? 1 : -1),
        date.getMinutes(),
        date.getSeconds()
      ]
        .map((n) => n.toString().padStart(2, '0'))
        .join(':');
      return `${datePart} ${timePart}`;
    };

    const startDate = formatDate(new Date(req.body.startDate), false);
    const endDate = formatDate(new Date(req.body.endDate), true);
    const daysHours = await getDaysHoursBetweenDates(startDate, endDate);
    if (id) {
      if (daysHours) {
        for (const day of daysHours) {
          const dH = {
            monthsHoursId: id,
            daysHoursId: day.id
          };
          await postMonthsHoursDaysHours(dH);
        }
      }
    }
    const messageResponse: MessageResponse = {
      message: 'MonthsHours created',
      id
    };
    res.json(messageResponse);
  } catch (error) {
    next(error);
  }
};

const monthsHoursPut = async (
  req: Request<{ id: string }, {}, MonthsHours>,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

    const result = await putMonthsHours(req.params.id, req.body);
    if (result.affectedRows === 0) {
      throw new CustomError('MonthsHours not updated', 400);
    }
    const messageResponse: MessageResponse = {
      message: 'MonthsHours updated',
      id: Number(req.params.id)
    };
    res.json(messageResponse);
  } catch (error) {
    next(error);
  }
};

const monthsHoursDelete = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await deleteMonthsHours(req.params.id);
    if (result.affectedRows === 0) {
      throw new CustomError('MonthsHours not deleted', 400);
    }
    const messageResponse: MessageResponse = {
      message: 'MonthsHours deleted',
      id: Number(req.params.id)
    };
    res.json(messageResponse);
  } catch (error) {
    next(error);
  }
};

export {
  monthsHoursListGet,
  monthsHoursGet,
  monthsHoursPost,
  monthsHoursPut,
  monthsHoursDelete
};
