import express from 'express';
import {
  vendorListGet,
  vendorGet,
  vendorPost,
  vendorPut,
  vendorDelete
} from '../controllers/vendorController';

const router = express.Router();

router.route('/').get(vendorListGet).post(vendorPost);

router.route('/:id').get(vendorGet).put(vendorPut).delete(vendorDelete);

export default router;
