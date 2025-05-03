import { Router } from 'express';
import { Get, Post, Put, Patch, Delete } from '../controllers/topics/index';
import { validator } from '../middlewares/validator';
import { idSchema } from '../schemas/abstracts';
import { Topics } from '../schemas';

const router = Router();

// Always when I see myself repeating code I start thinking in automations
// @TODO: Automatize all the routing system

router.get('/', Get);
router.get('/:id', Get);
router.post('/', validator({ body: Topics.base }), Post);

// For PUT , API's users will have to send all base Topic fields
// if they wanna update a single property the right http method is PATCH
router.put('/', validator({ params: idSchema, body: Topics.base }), Put);

// Here they can send only some fields
router.patch('/', validator({ params: idSchema, body: Topics.base.partial() }), Patch);

router.delete('/', validator({ params: idSchema }), Delete);
router.delete('/:id', validator({ params: idSchema }), Delete);


export default router;