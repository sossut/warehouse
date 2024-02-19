import express from 'express';
import {
  sentOutDocketListGet,
  sentOutDocketGet,
  sentOutDocketPost,
  sentOutDocketPut,
  sentOutDocketDelete
} from '../controllers/sentOutDocketController';
import { body, param } from 'express-validator';

import passport from 'passport';

const router = express.Router();

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), sentOutDocketListGet)
  .post(
    body('departureAt').isDate().optional().escape(),
    body('transportOptionId').isNumeric().optional().escape(),
    body('clientId').isNumeric().optional().escape(),
    body('filename').isString().optional().escape(),
    body('docketNumber').isString().optional().escape(),
    passport.authenticate('jwt', { session: false }),
    sentOutDocketPost
  );

router
  .route('/:id')
  .get(
    param('id').isNumeric(),
    passport.authenticate('jwt', { session: false }),
    sentOutDocketGet
  )
  .put(passport.authenticate('jwt', { session: false }), sentOutDocketPut)
  .delete(
    passport.authenticate('jwt', { session: false }),
    sentOutDocketDelete
  );
