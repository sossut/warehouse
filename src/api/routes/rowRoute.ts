import express from 'express';
import {
  rowListGet,
  rowGet,
  rowPost,
  rowPut,
  rowDelete,
  rowListGetGapsSpots
  // rowGapSpotPost
} from '../controllers/rowController';
import { body, param } from 'express-validator';
import passport from 'passport';

const router = express.Router();
router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), rowListGet)
  .post(
    body('rowNumber').isNumeric().notEmpty().escape(),
    body('gaps').isNumeric().notEmpty().escape(),
    passport.authenticate('jwt', { session: false }),
    rowPost
  );

router
  .route('/nested')
  .get(passport.authenticate('jwt', { session: false }), rowListGetGapsSpots);

router
  .route('/:id')
  .get(param('id').isNumeric(), rowGet)
  .put(
    body('rowNumber').isNumeric().optional().escape(),
    body('gaps').isNumeric().optional().escape(),
    passport.authenticate('jwt', { session: false }),
    rowPut
  )
  .delete(passport.authenticate('jwt', { session: false }), rowDelete);

export default router;
