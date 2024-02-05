import express, { Request } from 'express';
import {
  OutDocketListGet,
  OutDocketGet,
  OutDocketPost,
  OutDocketPut,
  OutDocketDelete
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
  .get(passport.authenticate('jwt', { session: false }), OutDocketListGet)
  .post(
    body('departureAt').isDate().optional().escape(),
    body('transportOptionId').isNumeric().optional().escape(),
    body('clientId').isNumeric().optional().escape(),
    upload.single('filename'),
    passport.authenticate('jwt', { session: false }),
    OutDocketPost
  );

router
  .route('/:id')
  .get(
    param('id').isNumeric(),
    passport.authenticate('jwt', { session: false }),
    OutDocketGet
  )
  .put(passport.authenticate('jwt', { session: false }), OutDocketPut)
  .delete(passport.authenticate('jwt', { session: false }), OutDocketDelete);

export default router;
