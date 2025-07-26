import usercontroller from '../Controller/userController.js'
import express from 'express'
const router = express.Router();

router.post('/add',usercontroller.createUser) ;
router.post('/login',usercontroller.login);
router.get('/search',usercontroller.serchuser);

export default router ;