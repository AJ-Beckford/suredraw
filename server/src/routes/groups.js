import express from 'express';
import { body } from 'express-validator';
import { invokeChaincode } from '../services/fabricService.js';
import { validateRequest } from '../middleware/errorHandler.js';
import authenticateJWT from '../middleware/auth.js';

const router = express.Router();

router.post('/', 
  authenticateJWT,
  [
    body('groupId').isAlphanumeric(),
    body('lifetimeDuration').isNumeric(),
    body('payoutSchedule').isJSON(),
    body('members').isArray({ min: 1 })
  ],
  validateRequest,
  async (req, res) => {
    try {
      const result = await invokeChaincode(
        req.user.identity,
        'createGroup',
        req.body.groupId,
        req.body.lifetimeDuration.toString(),
        req.body.payoutSchedule,
        JSON.stringify(req.body.members)
      );
      
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;