const { Router } = require('express');
const passwordController = require('../controllers/passwordController');

const router = Router();

router.get('/addpassword', passwordController.addpassword_get);
router.post('/addpassword', passwordController.addpassword_post);
router.get('/accesspassword', passwordController.accesspassword_get);
router.post('/delpassword', passwordController.delpassword_post);
router.post('/displaydeets', passwordController.displaydeets_post);


module.exports = router;