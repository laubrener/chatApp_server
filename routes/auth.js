// path: 'api/login'
const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, login, renewToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.post('/new', [
    check('name', 'name required').not().isEmpty(),
    check('email', 'email required').isEmail(),
    check('password', 'password required').not().isEmpty(),
    validateFields
], createUser);


router.post('/', [
    check('email', 'email required').isEmail(),
    check('password', 'password required').not().isEmpty(),
    validateFields
], login);

router.get('/renew', validateJWT, renewToken);

module.exports = router;