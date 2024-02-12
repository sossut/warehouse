import express from 'express';

import {
  productListGet,
  productGet,
  productPost,
  productPut,
  productDelete,
  productGetByCode
} from '../controllers/productController';

import { body, param } from 'express-validator';
import passport from 'passport';

const router = express.Router();

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), productListGet)
  .post(
    body('name').isString().optional().escape(),
    body('weight').isNumeric().optional().escape(),
    body('code').isString().notEmpty().escape(),
    passport.authenticate('jwt', { session: false }),
    productPost
  );

router
  .route('/code/:code')
  .get(
    param('code').isString().notEmpty().escape(),
    passport.authenticate('jwt', { session: false }),
    productGetByCode
  );

router
  .route('/:id')
  .get(
    param('id').isNumeric(),
    passport.authenticate('jwt', { session: false }),
    productGet
  )
  .put(
    body('name').isString().optional().escape(),
    body('weight').isNumeric().optional().escape(),
    body('code').isString().optional().escape(),
    body('quantityOptionId').isNumeric().notEmpty().escape(),
    passport.authenticate('jwt', { session: false }),
    productPut
  )
  .delete(passport.authenticate('jwt', { session: false }), productDelete);

export default router;
