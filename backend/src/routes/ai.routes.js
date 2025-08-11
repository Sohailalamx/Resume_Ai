import express from 'express';
import { getKeyPoints, getLatexCode } from '../controllers/ai.controller';
import { verifyJWT } from '../middlewares/auth.middleware';

const router = express.Router();

// @route post /api/ai/
// @desc provide the keyInsight from job description
// @access public
router.route('/').post(getKeyPoints(req, res));


// secure routes

// @route post /api/ai/latex
// @desc provide latex code of resume
// @access private
router.route('/latex').post(verifyJWT, getLatexCode(req, res));

export default router;