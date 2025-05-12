import { Router } from 'express';
import { Get, Post, Put, Patch, Delete } from '../controllers/resources/index';
import { validator } from '../middlewares/validator';
import { authenticator } from '../middlewares/authenticator';
import { roleChecker } from '../middlewares/roleChecker';
import { Abstracts, Resources } from '../schemas';
import { idSchema } from '../schemas/abstracts';

const router = Router();

// Always when I see myself repeating code I start thinking in automations
// @TODO: Automatize all the routing system

router.get('/:id', authenticator(), roleChecker('view_resources'), validator({ params: idSchema }), Get);

// Does not have validator call cause its supposed to get all the resources
router.get('/', authenticator(), roleChecker('view_resources'), Get);

router.post('/', authenticator(), roleChecker('create_resources'), validator({ body: Resources.base }), Post);

router.put('/:id', authenticator(), roleChecker('edit_resources'), validator({ params: idSchema, body: Resources.base }), Put);
router.put('/', authenticator(), roleChecker('edit_resources'), validator({ params: idSchema, body: Resources.base }), Put);

router.patch('/:id', authenticator(), roleChecker('edit_resources'), validator({ params: idSchema, body: Abstracts.patchSchema }), Patch);
router.patch('/', authenticator(), roleChecker('edit_resources'), validator({ params: idSchema, body: Abstracts.patchSchema }), Patch);

router.delete('/:id', authenticator(), roleChecker('delete_resources'), validator({ params: idSchema }), Delete);
router.delete('/', authenticator(), roleChecker('delete_resources'), validator({ params: idSchema }), Delete);


export default router;