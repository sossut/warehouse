import express, { Request } from 'express';
import {
  outDocketListGet,
  outDocketGet,
  outDocketPost,
  outDocketPut,
  outDocketDelete,
  outDocketListGetByIds,
  outDocketGetBackOrder
} from '../controllers/outDocketController';
import { body, param } from 'express-validator';

import dateFns from 'date-fns';

import passport from 'passport';
import multer, { FileFilterCallback } from 'multer';

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ dest: './uploads/', fileFilter });

const router = express.Router();

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), outDocketListGet)
  .post(
    body('departureAt')
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
    body('transportOptionId').isNumeric().optional().escape(),
    body('clientId').isNumeric().optional().escape(),
    body('filename').isString().optional().escape(),
    body('docketNumber').isString().optional().escape(),
    upload.single('filename'),
    passport.authenticate('jwt', { session: false }),
    outDocketPost
  );

router
  .route('/multiple')
  .post(
    passport.authenticate('jwt', { session: false }),
    body('ids').isArray({ min: 1 }).withMessage('At least one id is required'),
    outDocketListGetByIds
  );

router
  .route('/back-order')
  .post(
    passport.authenticate('jwt', { session: false }),
    body('ids').isArray({ min: 1 }).withMessage('At least one id is required'),
    outDocketGetBackOrder
  );

router
  .route('/:id')
  .get(
    param('id').isNumeric(),
    passport.authenticate('jwt', { session: false }),
    outDocketGet
  )
  .put(passport.authenticate('jwt', { session: false }), outDocketPut)
  .delete(passport.authenticate('jwt', { session: false }), outDocketDelete);

export default router;
