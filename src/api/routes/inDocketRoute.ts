import express from 'express';
import {
  inDocketListGet,
  inDocketGet,
  inDocketPost,
  inDocketPut,
  inDocketDelete
} from '../controllers/inDocketController';
import { body, param } from 'express-validator';
import dateFns from 'date-fns';
import passport from 'passport';
const router = express.Router();

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), inDocketListGet)
  .post(
    body('docketNumber').isString().notEmpty().escape(),
    body('vendorId').isNumeric().optional().escape(),
    body('arrivedAt')
      .optional({ nullable: true, checkFalsy: true })
      .custom((value) => {
        // Try to parse the value as an ISO 8601 date
        const parsedDate = dateFns.parseISO(value);
        // Check if the parsed date is valid
        return dateFns.isValid(parsedDate);
      })
      .withMessage('Invalid date')
      .bail()
      .toDate(),
    body('filename').isString().optional().escape(),
    passport.authenticate('jwt', { session: false }),
    inDocketPost
  );

router
  .route('/:id')
  .get(
    param('id').isNumeric(),
    passport.authenticate('jwt', { session: false }),
    inDocketGet
  )
  .put(
    param('id').isNumeric(),
    body('docketNumber').isString().optional().escape(),
    body('vendorId').isNumeric().optional().escape(),
    body('arrivedAt')
      .optional({ nullable: true, checkFalsy: true })
      .custom((value) => {
        // Try to parse the value as an ISO 8601 date
        const parsedDate = dateFns.parseISO(value);
        // Check if the parsed date is valid
        return dateFns.isValid(parsedDate);
      })
      .withMessage('Invalid date')
      .bail()
      .toDate(),
    body('filename').isString().optional().escape(),
    passport.authenticate('jwt', { session: false }),
    inDocketPut
  )
  .delete(param('id').isNumeric(), inDocketDelete);

export default router;
