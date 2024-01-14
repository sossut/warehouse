import express from 'express';

import {
  clientListGet,
  clientGet,
  clientPost,
  clientPut,
  clientDelete
} from '../controllers/clientController';
import passport from 'passport';
import { body } from 'express-validator';

const router = express.Router();

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), clientListGet)
  .post(body('name').isString().notEmpty().escape(), clientPost);

router
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), clientGet)
  .put(
    passport.authenticate('jwt', { session: false }),
    body('name').isString().notEmpty().escape(),
    clientPut
  )
  .delete(passport.authenticate('jwt', { session: false }), clientDelete);

export default router;
