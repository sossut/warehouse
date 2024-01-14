import express from 'express';
import {
  spotListGet,
  spotGet,
  spotPost,
  spotPut,
  spotDelete,
  spotGapRowPost
} from '../controllers/spotController';
import { body, check, param } from 'express-validator';
import passport from 'passport';

const router = express.Router();

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), spotListGet)
  .post(
    body('spotNumber').isNumeric().notEmpty().escape(),
    body('gapId').isString().notEmpty().escape(),
    body('rowId').isInt().notEmpty().escape(),
    passport.authenticate('jwt', { session: false }),
    spotPost
  );

router
  .route('/all')
  .post(
    check('data').isArray().notEmpty(),
    check('data.*.rowNumber').isNumeric().notEmpty().escape(),
    check('data.*.gaps').isNumeric().notEmpty().escape(),
    check('data.*.data').isArray().notEmpty(),
    check('data.*.data.*.gapNumber').isNumeric().notEmpty().escape(),
    check('data.*.data.*.spots').isNumeric().notEmpty().escape(),
    check('data.*.data.*.data').isArray().notEmpty(),
    check('data.*.data.*.data.*.spotNumber').isNumeric().notEmpty().escape(),
    passport.authenticate('jwt', { session: false }),
    spotGapRowPost
  );

router
  .route('/:id')
  .get(param('id').isNumeric(), spotGet)
  .put(
    body('spotNumber').isNumeric().notEmpty().escape(),
    body('gapId').isString().notEmpty().escape(),
    body('rowId').isInt().notEmpty().escape(),
    passport.authenticate('jwt', { session: false }),
    spotPut
  )
  .delete(passport.authenticate('jwt', { session: false }), spotDelete);

export default router;
