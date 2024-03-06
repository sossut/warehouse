import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import userRoute from './routes/userRoute';
import productRoute from './routes/productRoute';
import authRoute from './routes/authRoute';
import rowRoute from './routes/rowRoute';
import gapRoute from './routes/gapRoute';
import spotRoute from './routes/spotRoute';
import palletRoute from './routes/palletRoute';
import quantityOptionRoute from './routes/quantityOptionRoute';
import transportOptionRoute from './routes/transportOptionRoute';
import OutDocketRoute from './routes/outDocketRoute';
import clientRoute from './routes/clientRoute';
import sentOutDocketRoute from './routes/sentOutDocketRoute';
import inDocketRoute from './routes/inDocketRoute';
import vendorRoute from './routes/vendorRoute';
const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message:
      'api/v1/ - user, product, auth, row, gap, spot, pallet, quantity-option, transport-option, OutDocket, client, sent-outdocket'
  });
});

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/product', productRoute);
router.use('/row', rowRoute);
router.use('/gap', gapRoute);
router.use('/spot', spotRoute);
router.use('/pallet', palletRoute);
router.use('/quantity-option', quantityOptionRoute);
router.use('/transport-option', transportOptionRoute);
router.use('/outdocket', OutDocketRoute);
router.use('/client', clientRoute);
router.use('/sent-outdocket', sentOutDocketRoute);
router.use('/indocket', inDocketRoute);
router.use('/vendor', vendorRoute);

export default router;
