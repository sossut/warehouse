import { validationResult } from 'express-validator';

import {
  getAllPallets,
  getPallet,
  postPallet,
  putPallet,
  deletePallet
} from '../models/palletModel';

import { Request, Response, NextFunction } from 'express';
import { PostPallet, PutPallet } from '../../interfaces/Pallet';

import CustomError from '../../classes/CustomError';
import MessageResponse from '../../interfaces/MessageResponse';
import {
  deletePalletProductByPalletId,
  getPalletProductsIdsByPalletId,
  postPalletProduct
} from '../models/palletProductModel';
import { PalletProduct } from '../../interfaces/PalletProduct';

const palletListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pallets = await getAllPallets();
    res.json(pallets);
  } catch (error) {
    next(error);
  }
};

const palletGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const pallet = await getPallet(req.params.id);
    res.json(pallet);
  } catch (error) {
    next(error);
  }
};

const palletPost = async (
  req: Request<{}, {}, PostPallet>,
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
    const id = await postPallet();
    const products = req.body.products;
    if (products) {
      for (const product of products) {
        let quantity = product.quantity;
        if (!quantity) {
          quantity = 0;
        }
        const pp: PalletProduct = {
          palletId: id,
          productId: product.productId,
          quantity: quantity
        };
        await postPalletProduct(pp);
      }
    }
    if (id) {
      const message: MessageResponse = {
        message: 'Pallet created',
        id
      };
      res.status(201).json(message);
    }
  } catch (error) {
    next(error);
  }
};

const palletPut = async (
  req: Request<{ id: string }, {}, PutPallet>,
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
    const products = req.body.products;
    if (products) {
      let palletProducts: PalletProduct[];
      try {
        palletProducts =
          (await getPalletProductsIdsByPalletId(parseInt(req.params.id))) || [];
      } catch (error) {
        palletProducts = [];
      }
      const result = deletePalletProductByPalletId(parseInt(req.params.id));
      if (!result) {
        return;
      }

      for (const product of products) {
        let quantity = product.quantity;
        if (!quantity) {
          quantity = 0;
        }
        const pp: PalletProduct = {
          palletId: parseInt(req.params.id),
          productId: product.productId,
          quantity: quantity
        };
        const pp1 = await postPalletProduct(pp);
        if (pp1) {
          palletProducts.push(pp);
        }
      }
    }
    delete req.body.products;
    req.body.updatedAt = new Date();
    const result = await putPallet(req.body, parseInt(req.params.id));
    if (result) {
      const message: MessageResponse = {
        message: 'Pallet updated',
        id: parseInt(req.params.id)
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

const palletDelete = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await deletePallet(parseInt(req.params.id));
    if (result) {
      const message: MessageResponse = {
        message: 'Pallet deleted',
        id: parseInt(req.params.id)
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

export { palletListGet, palletGet, palletPost, palletPut, palletDelete };
