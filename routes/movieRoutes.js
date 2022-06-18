const express = require('express')
const router = express.Router()
const {getMovie, searchMovie, rateMovies} = require('../controllers/movieController')
router.route('/').get(getMovie) 
router.route('/search').get(searchMovie) 
router.route('/rate').post(rateMovies) 


module.exports = router