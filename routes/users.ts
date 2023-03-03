import express from 'express';
const router = express.Router();
import {connectionDB} from '../server'
import {createUser, deleteAccount, getAllUsers, loginUser, logoutUser} from '../controllers/users.controller'


router.get('/', getAllUsers)
router.post('/register', createUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser);
router.delete('/account/:id', deleteAccount)


module.exports = router;

