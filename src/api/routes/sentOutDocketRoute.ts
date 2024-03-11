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
import {
  pendingShipmentListGet,
  pendingShipmentPost
} from '../controllers/pendingShipmentController';

const router = express.Router();

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), sentOutDocketListGet)
  .post(
    body('departureAt')
      .custom((value) => {
        if (!value) return true;
        const date = Date.parse(value);
        if (isNaN(date)) {
          throw new Error('Invalid date format');
        }
        return true;
      })
      .optional()
      .escape(),
    body('parcels').isNumeric().optional().escape(),
    body('transportOptionId').isNumeric().optional().escape(),
    body('docketId').isNumeric().notEmpty().escape(),
    passport.authenticate('jwt', { session: false }),
    sentOutDocketPost
  );

router
  .route('/pending')
  .get(passport.authenticate('jwt', { session: false }), pendingShipmentListGet)
  .post(
    body('departureAt')
      .custom((value) => {
        if (!value) return true;
        const date = Date.parse(value);
        console.log(date);
        if (isNaN(date)) {
          throw new Error('Invalid date format');
        }
        return true;
      })
      .optional()
      .escape(),
    body('parcels').isNumeric().optional().escape(),
    body('transportOptionId').isNumeric().optional().escape(),
    body('docketId').isNumeric().notEmpty().escape(),
    passport.authenticate('jwt', { session: false }),
    pendingShipmentPost
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

export default router;
