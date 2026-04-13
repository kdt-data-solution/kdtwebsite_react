import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ status: 'Welcome', uptime: process.uptime() });
});

export default router;
