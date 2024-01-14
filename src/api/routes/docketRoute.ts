import express from 'express';
import {
  docketListGet,
  docketGet,
  docketPost,
  docketPut,
  docketDelete
} from '../controllers/docketController';
import { body, param } from 'express-validator';

import passport from 'passport';

const router = express.Router();

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), docketListGet)
  .post(
    body('departureAt').isDate().optional().escape(),
    body('transportOptionId').isNumeric().optional().escape(),
    body('clientId').isNumeric().optional().escape(),
    passport.authenticate('jwt', { session: false }),
    docketPost
  );

router
  .route('/:id')
  .get(
    param('id').isNumeric(),
    passport.authenticate('jwt', { session: false }),
    docketGet
  )
  .put(passport.authenticate('jwt', { session: false }), docketPut)
  .delete(passport.authenticate('jwt', { session: false }), docketDelete);

export default router;
