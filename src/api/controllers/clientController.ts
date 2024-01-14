import { validationResult } from 'express-validator';

import {
  getAllClients,
  getClient,
  postClient,
  putClient,
  deleteClient
} from '../models/clientModel';

import { Request, Response, NextFunction } from 'express';

import { PutClient, PostClient } from '../../interfaces/Client';

import CustomError from '../../classes/CustomError';
import MessageResponse from '../../interfaces/MessageResponse';

const clientListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clients = await getAllClients();
    res.json(clients);
  } catch (error) {
    next(error);
  }
};

const clientGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const client = await getClient(req.params.id);
    res.json(client);
  } catch (error) {
    next(error);
  }
};

const clientPost = async (
  req: Request<{}, {}, PostClient>,
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
    const clientId = await postClient(req.body);
    const message: MessageResponse = {
      message: 'Client created',
      id: clientId
    };
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

const clientPut = async (
  req: Request<{ id: string }, {}, PutClient>,
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

    const client = req.body;
    const result = await putClient(client, parseInt(req.params.id));
    if (result) {
      const message: MessageResponse = {
        message: 'Client updated',
        id: parseInt(req.params.id)
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

const clientDelete = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await deleteClient(parseInt(req.params.id));
    if (result) {
      const message: MessageResponse = {
        message: 'Client deleted',
        id: parseInt(req.params.id)
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

export { clientListGet, clientGet, clientPost, clientPut, clientDelete };
