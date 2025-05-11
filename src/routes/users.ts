import { Router } from 'express';
import { Get, Post, Put, Patch, Delete } from '../controllers/users/index';
import { PostLogin } from '../controllers/users/postLogin';
import { validator } from '../middlewares/validator';
import { loginSchema } from '../schemas/users';
import { authenticator } from '../middlewares/authenticator';
import { roleChecker } from '../middlewares/roleChecker';
import { Abstracts, Users } from '../schemas';
import { idSchema } from '../schemas/abstracts';

const router = Router();

// Always when I see myself repeating code I start thinking in automations
// @TODO: Automatize all the routing system

router.post('/login', validator({ body: loginSchema }), PostLogin);

router.get('/:id', authenticator(), roleChecker('view_users'), validator({ params: idSchema }), Get);

// Does not have validator call cause its supposed to get all the users
router.get('/', authenticator(), roleChecker('view_users'), Get);

router.post('/', authenticator(), roleChecker('create_users'), validator({ body: Users.base }), Post);

router.put('/:id', authenticator(), roleChecker('edit_users'), validator({ params: idSchema, body: Users.base }), Put);
router.put('/', authenticator(), roleChecker('edit_users'), validator({ params: idSchema, body: Users.base }), Put);

router.patch('/:id', authenticator(), roleChecker('edit_users'), validator({ params: idSchema, body: Abstracts.patchSchema }), Patch);
router.patch('/', authenticator(), roleChecker('edit_users'), validator({ params: idSchema, body: Abstracts.patchSchema }), Patch);

router.delete('/:id', authenticator(), roleChecker('delete_users'), validator({ params: idSchema }), Delete);
router.delete('/', authenticator(), roleChecker('delete_users'), validator({ params: idSchema }), Delete);


export default router;