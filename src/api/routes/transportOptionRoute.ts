import express from 'express';
import {
  transportOptionListGet,
  transportOptionGet,
  transportOptionPost,
  transportOptionPut,
  transportOptionDelete
} from '../controllers/transportOptionController';
import { body, param } from 'express-validator';

import passport from 'passport';

const router = express.Router();

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), transportOptionListGet)
  .post(
    body('transportOption').isString().notEmpty().escape(),
    passport.authenticate('jwt', { session: false }),
    transportOptionPost
  );

router
  .route('/:id')
  .get(
    param('id').isNumeric(),
    passport.authenticate('jwt', { session: false }),
    transportOptionGet
  )
  .put(passport.authenticate('jwt', { session: false }), transportOptionPut)
  .delete(
    passport.authenticate('jwt', { session: false }),
    transportOptionDelete
  );

export default router;
