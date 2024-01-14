import express from 'express';
import {
  quantityOptionListGet,
  quantityOptionGet,
  quantityOptionPost,
  quantityOptionPut,
  quantityOptionDelete
} from '../controllers/quantityOptionController';
import { body, param } from 'express-validator';

import passport from 'passport';

const router = express.Router();

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), quantityOptionListGet)
  .post(
    body('quantityOption').isNumeric().notEmpty().escape(),
    passport.authenticate('jwt', { session: false }),
    quantityOptionPost
  );

router
  .route('/:id')
  .get(
    param('id').isNumeric(),
    passport.authenticate('jwt', { session: false }),
    quantityOptionGet
  )
  .put(passport.authenticate('jwt', { session: false }), quantityOptionPut)
  .delete(
    passport.authenticate('jwt', { session: false }),
    quantityOptionDelete
  );

export default router;
