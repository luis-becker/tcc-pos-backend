const express = require('express')
const authController = require('../controllers/authController')
const {authorization} = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/', authorization)
router.get('/logout', authorization)


router.get('/logout', authController.logout)
router.get('/', authController.validateToken)
router.post('/login', authController.login)
router.post('/register', authController.register)

module.exports = router