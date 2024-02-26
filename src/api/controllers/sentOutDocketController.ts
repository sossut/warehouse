import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import {
  getAllSentOutDockets,
  getSentOutDocket,
  postSentOutDocket,
  putSentOutDocket,
  deleteSentOutDocket
} from '../models/sentOutDocketModel';
import CustomError from '../../classes/CustomError';
import {
  PostSentOutDocket,
  PutSentOutDocket
} from '../../interfaces/SentOutDocket';
import { postSentOutDocketProduct } from '../models/sentOutDocketProductModel';
import { SentOutDocketProduct } from '../../interfaces/SentOutDocketProduct';
import { getProduct, putProduct } from '../models/productModel';
import MessageResponse from '../../interfaces/MessageResponse';
import {
  getOutDocketProductByOutDocketIdAndProductId,
  putOutDocketProductByOutDocketIdAndProductId
} from '../models/outDocketProductModel';
import { putOutDocket } from '../models/outDocketModel';

const sentOutDocketListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sentOutDockets = await getAllSentOutDockets();
    if (sentOutDockets.length === 0) {
      throw new CustomError('No sentOutDockets found', 404);
    }
    res.json(sentOutDockets);
  } catch (error) {
    next(error);
  }
};

const sentOutDocketGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const sentOutDocket = await getSentOutDocket(req.params.id);
    if (!sentOutDocket) {
      throw new CustomError('SentOutDocket not found', 404);
    }
    res.json(sentOutDocket);
  } catch (error) {
    next(error);
  }
};

const sentOutDocketPost = async (
  req: Request<{}, {}, PostSentOutDocket>,
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
          return error.msg;
        })
        .join(', ');
      throw new CustomError(messages, 400);
    }
    req.body.departureAt = new Date(
      new Date(req.body.departureAt)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ')
    );
    if (!req.body.departureAt) {
      req.body.departureAt = new Date();
    }
    req.body.userId = (req.user as any).id;
    const sentOutDocket = await postSentOutDocket(req.body);
    console.log(sentOutDocket);
    const products = req.body.products;
    if (sentOutDocket) {
      if (products) {
        let allProductsDelivered = true;
        for (const product of products) {
          let deliveredProductQuantity = product.deliveredProductQuantity;
          if (!deliveredProductQuantity || deliveredProductQuantity < 0) {
            deliveredProductQuantity = 0;
          }
          const dp: SentOutDocketProduct = {
            sentOutDocketId: sentOutDocket,
            productId: product.productId,
            deliveredProductQuantity: deliveredProductQuantity,
            orderedProductQuantity: product.orderedProductQuantity
          };

          const outDocketProduct =
            await getOutDocketProductByOutDocketIdAndProductId(
              req.body.docketId as number,
              product.productId
            );
          dp.orderedProductQuantity = outDocketProduct.orderedProductQuantity;
          if (
            dp.deliveredProductQuantity +
              outDocketProduct.deliveredProductQuantity >=
            outDocketProduct.orderedProductQuantity
          ) {
            dp.deliveredProductQuantity =
              outDocketProduct.orderedProductQuantity -
              outDocketProduct.deliveredProductQuantity;
          }
          await postSentOutDocketProduct(dp);
          let delivered =
            outDocketProduct.deliveredProductQuantity +
            deliveredProductQuantity;
          if (delivered >= outDocketProduct.orderedProductQuantity) {
            delivered = outDocketProduct.orderedProductQuantity;
          } else {
            allProductsDelivered = false;
          }
          if (product.productId == outDocketProduct.productId) {
            await putOutDocketProductByOutDocketIdAndProductId(
              { deliveredProductQuantity: delivered },
              req.body.docketId as number,
              product.productId
            );
          }

          const productQuantity = await getProduct(
            product.productId.toString()
          );

          const quantity = productQuantity.quantity - deliveredProductQuantity;
          await putProduct({ quantity }, product.productId);
          if (allProductsDelivered) {
            await putOutDocket(
              { status: 'closed' },
              req.body.docketId as number
            );
          }
        }
      }
    }
    const message: MessageResponse = {
      message: 'SentOutDocket created',
      id: sentOutDocket
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

const sentOutDocketPut = async (
  req: Request<{ id: string }, {}, PutSentOutDocket>,
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
          return error.msg;
        })
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const sentOutDocket = await putSentOutDocket(req.params.id, req.body);
    res.json(sentOutDocket);
  } catch (error) {
    next(error);
  }
};

const sentOutDocketDelete = async (
  req: Request<{ id: string }, {}, {}>,
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
          return error.msg;
        })
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const sentOutDocket = await deleteSentOutDocket(req.params.id);
    res.json(sentOutDocket);
  } catch (error) {
    next(error);
  }
};

export {
  sentOutDocketListGet,
  sentOutDocketGet,
  sentOutDocketPost,
  sentOutDocketPut,
  sentOutDocketDelete
};
