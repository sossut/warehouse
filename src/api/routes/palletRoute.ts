import express from 'express';
import {
  palletListGet,
  palletGet,
  palletPost,
  palletPut,
  palletDelete
} from '../controllers/palletController';

import passport from 'passport';
import { param } from 'express-validator';

const router = express.Router();

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), palletListGet)
  .post(passport.authenticate('jwt', { session: false }), palletPost);

router
  .route('/:id')
  .get(
    param('id').isNumeric(),
    passport.authenticate('jwt', { session: false }),
    palletGet
  )
  .put(passport.authenticate('jwt', { session: false }), palletPut)
  .delete(passport.authenticate('jwt', { session: false }), palletDelete);

export default router;
