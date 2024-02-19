import express, { Request } from 'express';
import {
  outDocketListGet,
  outDocketGet,
  outDocketPost,
  outDocketPut,
  outDocketDelete
} from '../controllers/outDocketController';
import { body, param } from 'express-validator';

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
    body('departureAt').isDate().optional().escape(),
    body('transportOptionId').isNumeric().optional().escape(),
    body('clientId').isNumeric().optional().escape(),
    body('filename').isString().optional().escape(),
    body('docketNumber').isString().optional().escape(),
    upload.single('filename'),
    passport.authenticate('jwt', { session: false }),
    outDocketPost
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
