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
    body('parcels').isNumeric().notEmpty().escape(),
    body('transportOptionId').isNumeric().optional().escape(),
    body('docketId').isNumeric().notEmpty().escape(),
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
