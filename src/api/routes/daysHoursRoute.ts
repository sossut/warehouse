import express from 'express';
import {
  daysHoursListGet,
  daysHoursGet,
  daysHoursPost,
  daysHoursPut,
  daysHoursDelete
} from '../controllers/daysHoursController';
import dateFns from 'date-fns';
import { body, param } from 'express-validator';
import passport from 'passport';
const router = express.Router();

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), daysHoursListGet)
  .post(
    body('day')
      .custom((value) => {
        // Try to parse the value as an ISO 8601 date
        const parsedDate = dateFns.parseISO(value);
        // Check if the parsed date is valid
        return dateFns.isValid(parsedDate);
      })
      .withMessage('Invalid date')
      .bail()
      .toDate(),
    body('workedHoursSeconds').isNumeric().notEmpty().escape(),
    body('kilometers').isNumeric().optional().escape(),
    passport.authenticate('jwt', { session: false }),
    daysHoursPost
  );

router
  .route('/:id')
  .get(
    param('id').isNumeric(),
    passport.authenticate('jwt', { session: false }),
    daysHoursGet
  )
  .put(
    body('day').isString().notEmpty().escape(),
    body('workedHours').isNumeric().notEmpty().escape(),
    body('kilometers').isNumeric().optional().escape(),
    passport.authenticate('jwt', { session: false }),
    daysHoursPut
  )
  .delete(
    param('id').isNumeric(),
    passport.authenticate('jwt', { session: false }),
    daysHoursDelete
  );

export default router;
