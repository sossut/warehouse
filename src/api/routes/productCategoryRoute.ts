import express from 'express';
import {
  productCategoryListGet,
  productCategoryGet,
  productCategoryPost,
  productCategoryPut,
  productCategoryDelete
} from '../controllers/productCategoryController';

import {
  productSubCategoryListGet,
  productSubCategoryGet,
  productSubCategoryPost,
  productSubCategoryPut,
  productSubCategoryDelete
} from '../controllers/productSubCategoryController';

import passport from 'passport';
import { body, param } from 'express-validator';

const router = express.Router();

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), productCategoryListGet)
  .post(
    body('name').isString().notEmpty().escape(),
    passport.authenticate('jwt', { session: false }),
    productCategoryPost
  );

router
  .route('/:id')
  .get(
    param('id').isNumeric(),
    passport.authenticate('jwt', { session: false }),
    productCategoryGet
  )
  .put(
    body('name').isString().notEmpty().escape(),
    passport.authenticate('jwt', { session: false }),
    productCategoryPut
  )
  .delete(
    param('id').isNumeric(),
    passport.authenticate('jwt', { session: false }),
    productCategoryDelete
  );

router
  .route('/subcategory/')
  .get(
    param('id').isNumeric(),
    passport.authenticate('jwt', { session: false }),
    productSubCategoryListGet
  )
  .post(
    body('name').isString().notEmpty().escape(),
    body('productCategoryId').isNumeric().notEmpty().escape(),
    passport.authenticate('jwt', { session: false }),
    productSubCategoryPost
  );

router
  .route('/subcategory/:id')
  .get(
    param('id').isNumeric(),

    passport.authenticate('jwt', { session: false }),
    productSubCategoryGet
  )
  .put(
    body('name').isString().notEmpty().escape(),
    body('productCategoryId').isNumeric().notEmpty().escape(),
    passport.authenticate('jwt', { session: false }),
    productSubCategoryPut
  )
  .delete(
    param('id').isNumeric(),
    passport.authenticate('jwt', { session: false }),
    productSubCategoryDelete
  );
