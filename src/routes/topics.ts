import { Router } from 'express';
import { Get, GetPath, Post, Put, Patch, Delete } from '../controllers/topics/index';
import { validator } from '../middlewares/validator';
import { idSchema, patchSchema } from '../schemas/abstracts';
import { Topics } from '../schemas';

const router = Router();

// Always when I see myself repeating code I start thinking in automations
// @TODO: Automatize all the routing system

router.get('/', validator({ query: Topics.getSchema}), Get);
router.get('/path', validator({ query: Topics.getPathSchema}), GetPath);
router.get('/:id', validator({ query: Topics.getSchema}), Get);


router.post('/', validator({ body: Topics.base }), Post);

// I've decided that for PUT , API's users will have to send all base Topic fields
// if they wanna update a single property the right http method is PATCH
router.put('/', validator({ params: idSchema, body: Topics.base }), Put);
router.put('/:id', validator({ params: idSchema, body: Topics.base }), Put);

// In this method they can update the resource partially, but must follow RFC rfc6902 body format
router.patch('/', validator({ params: idSchema, body: patchSchema }), Patch);
router.patch('/:id', validator({ params: idSchema, body: patchSchema }), Patch);

router.delete('/', validator({ params: idSchema }), Delete);
router.delete('/:id', validator({ params: idSchema }), Delete);

// explanation why i am registering two routes / and /:id (in methods that support it)
// its just for users guidance, if it calls without /:id they receive explanation to include the id

export default router;