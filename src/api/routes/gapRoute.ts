import express from 'express';
import {
  gapListGet,
  gapGet,
  gapPost,
  gapPut,
  gapDelete
} from '../controllers/gapController';
import { body, param } from 'express-validator';

import passport from 'passport';
const router = express.Router();

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), gapListGet)
  .post(
    body('gapNumber').isNumeric().notEmpty().escape(),
    body('rowId').isNumeric().notEmpty().escape(),
    body('spots').isNumeric().notEmpty().escape(),
    passport.authenticate('jwt', { session: false }),
    gapPost
  );

router
  .route('/:id')
  .get(
    param('id').isNumeric(),
    passport.authenticate('jwt', { session: false }),
    gapGet
  )
  .put(passport.authenticate('jwt', { session: false }), gapPut)
  .delete(passport.authenticate('jwt', { session: false }), gapDelete);

export default router;
