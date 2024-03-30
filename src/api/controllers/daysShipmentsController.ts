import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

import CustomError from '../../classes/CustomError';
import MessageResponse from '../../interfaces/MessageResponse';
import { DaysShipmentsSentOutDocket } from '../../interfaces/DaysShipmentsSentOutDocket';
import {
  getAllDaysShipments,
  getDaysShipments,
  postDaysShipments,
  putDaysShipments,
  deleteDaysShipments
} from '../models/daysShipmentsModel';
import { DaysShipments } from '../../interfaces/DaysShipments';
import { postDaysShipmentsSentOutDocket } from '../models/daysShipmentsSentOutDocketModel';

const daysShipmentsListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const daysShipments = await getAllDaysShipments();
    res.json(daysShipments);
  } catch (error) {
    next(error);
  }
};

const daysShipmentsGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const daysShipments = await getDaysShipments(req.params.id);
    res.json(daysShipments);
  } catch (error) {
    next(error);
  }
};

const daysShipmentsPost = async (
  req: Request<{}, {}, DaysShipments>,
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
    req.body.departedAt = new Date(
      new Date(req.body.departedAt).toISOString().slice(0, 19).replace('T', ' ')
    );
    const id = await postDaysShipments(req.body);
    const sentOutDockets = req.body.sentOutDockets;

    if (sentOutDockets) {
      for (const sentOutDocket of sentOutDockets) {
        const dssod: DaysShipmentsSentOutDocket = {
          daysShipmentsId: id,
          sentOutDocketId: sentOutDocket.sentOutDocketId as number
        };
        await postDaysShipmentsSentOutDocket(dssod);
      }
    }
    res.json({ id });
  } catch (error) {
    next(error);
  }
};

const daysShipmentsPut = async (
  req: Request<{ id: string }, {}, DaysShipments>,
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
    req.body.json = JSON.stringify(req.body.json);
    const result = await putDaysShipments(req.body, parseInt(req.params.id));
    if (!result) {
      throw new CustomError('DaysShipments not updated', 400);
    }
    const message: MessageResponse = {
      message: 'DaysShipments updated',
      id: parseInt(req.params.id)
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

const daysShipmentsDelete = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await deleteDaysShipments(parseInt(req.params.id));
    if (!result) {
      throw new CustomError('DaysShipments not deleted', 400);
    }
    const message: MessageResponse = {
      message: 'DaysShipments deleted',
      id: parseInt(req.params.id)
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

export {
  daysShipmentsListGet,
  daysShipmentsGet,
  daysShipmentsPost,
  daysShipmentsPut,
  daysShipmentsDelete
};
