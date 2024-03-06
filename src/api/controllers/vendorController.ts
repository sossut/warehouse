import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

import CustomError from '../../classes/CustomError';
import MessageResponse from '../../interfaces/MessageResponse';

import {
  getAllVendors,
  getVendor,
  postVendor,
  putVendor,
  deleteVendor
} from '../models/vendorModel';
import { PostVendor, PutVendor } from '../../interfaces/Vendor';

const vendorListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendors = await getAllVendors();
    if (vendors.length === 0) {
      throw new CustomError('No vendors found', 404);
    }
    res.json(vendors);
  } catch (error) {
    next(error);
  }
};

const vendorGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendor = await getVendor(req.params.id);
    if (!vendor) {
      throw new CustomError('Vendor not found', 404);
    }
    res.json(vendor);
  } catch (error) {
    next(error);
  }
};

const vendorPost = async (
  req: Request<{}, {}, PostVendor>,
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
    const vendor = await postVendor(req.body);
    res.json(vendor);
  } catch (error) {
    next(error);
  }
};

const vendorPut = async (
  req: Request<{ id: number }, {}, PutVendor>,
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
    const vendor = await putVendor(req.body, req.params.id);
    res.json(vendor);
  } catch (error) {
    next(error);
  }
};

const vendorDelete = async (
  req: Request<{ id: number }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendor = await deleteVendor(req.params.id);
    res.json(vendor);
  } catch (error) {
    next(error);
  }
};

export { vendorListGet, vendorGet, vendorPost, vendorPut, vendorDelete };
