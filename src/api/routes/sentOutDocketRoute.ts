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
  pendingShipmentDelete,
  pendingShipmentGet,
  pendingShipmentListGet,
  pendingShipmentPost,
  pendingShipmentPut
} from '../controllers/pendingShipmentController';
import {
  daysShipmentsDelete,
  daysShipmentsGet,
  daysShipmentsListGet,
  daysShipmentsPost,
  daysShipmentsPut
} from '../controllers/daysShipmentsController';

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
  .route('/pending/:id')
  .get(
    param('id').isNumeric(),
    passport.authenticate('jwt', { session: false }),
    pendingShipmentGet
  )
  .put(passport.authenticate('jwt', { session: false }), pendingShipmentPut)
  .delete(
    param('id').isNumeric(),
    passport.authenticate('jwt', { session: false }),
    pendingShipmentDelete
  );

router
  .route('/days-shipments')
  .get(passport.authenticate('jwt', { session: false }), daysShipmentsListGet)
  .post(
    body('departedAt')
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
    body('json').isString().optional().escape(),
    passport.authenticate('jwt', { session: false }),
    daysShipmentsPost
  );

router
  .route('/days-shipments/:id')
  .get(
    param('id').isNumeric(),
    passport.authenticate('jwt', { session: false }),
    daysShipmentsGet
  )
  .put(passport.authenticate('jwt', { session: false }), daysShipmentsPut)
  .delete(
    param('id').isNumeric(),
    passport.authenticate('jwt', { session: false }),
    daysShipmentsDelete
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
