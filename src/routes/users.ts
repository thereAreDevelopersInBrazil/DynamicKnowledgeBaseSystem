import { Router } from 'express';
import { Get, Post, Put, Patch, Delete } from '../controllers/users/index';

const router = Router();

router.get('/', Get);
router.post('/', Post);
router.put('/', Put);
router.patch('/', Patch);
router.delete('/', Delete);


export default router;