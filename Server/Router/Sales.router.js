import express from 'express';
import { getAllSales } from '../Controller/Sales.Controller.js';
const router = express.Router();

router.get('/', getAllSales)

export default router;