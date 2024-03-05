import express from 'express';
import {
  inDocketListGet,
  inDocketGet,
  inDocketPost,
  inDocketPut,
  inDocketDelete
} from '../controllers/inDocketController';
import { body, param } from 'express-validator';

const router = express.Router();

router
  .route('/')
  .get(inDocketListGet)
  .post(
    body('inDocketNumber').isString().notEmpty().escape(),
    body('vendorId').isString().optional().escape(),
    body('arrivedAt').isDate().notEmpty().escape(),
    inDocketPost
  );

router
  .route('/:id')
  .get(param('id').isNumeric(), inDocketGet)
  .put(
    param('id').isNumeric(),
    body('inDocketNumber').isString().optional().escape(),
    body('vendorId').isString().optional().escape(),
    body('arrivedAt').isDate().optional().escape(),
    inDocketPut
  )
  .delete(param('id').isNumeric(), inDocketDelete);

export default router;
