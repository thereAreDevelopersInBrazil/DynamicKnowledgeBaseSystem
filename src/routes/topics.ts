import { Router } from 'express';
import { Get, Post, Put, Patch, Delete } from '../controllers/topics/index';

const router = Router();

// Always when I see myself repeating code I start thinking in automations
// @TODO: Automatize all the routing system

router.get('/', Get);
router.post('/', Post);
router.put('/', Put);
router.patch('/', Patch);
router.delete('/', Delete);


export default router;