import express from 'express';
import userController from '../controllers/userController';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

router.post('/', asyncHandler(userController.create));
router.get('/', asyncHandler(userController.getAllUsers));
router.post('/deviceId', asyncHandler(userController.registerDeviceId));

router.delete('/:username', asyncHandler(userController.remove));
router.put('/:username', asyncHandler(userController.updatePassword));
router.get('/:username', asyncHandler(userController.getByUsername));
router.put('/:username/device', asyncHandler(userController.updateDeviceId));
router.patch('/:username/stats', asyncHandler(userController.updateStats));

export default router;
