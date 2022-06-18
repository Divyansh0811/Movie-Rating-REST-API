const asyncHandler = require("express-async-handler");
const Movie = require("../models/movieModel");

//Description: Get list all movies
//Route: GET /api/movie
//access: public
const getMovie = asyncHandler(async (req, res) => {
 const movies = await Movie.find({});

 res.status(200).json(movies);
});

//Description: Search for a movie
// Route: GET /api/movie/search
//access: public
const searchMovie = asyncHandler(async (req, res) => {
 if (!req.body.moviename) {
  req.status(400);
  throw new Error("Please mention the movie name");
 }
 const { moviename } = req.body.moviename;
 const searchedmovie = await Movie.findOne(moviename);

 res.status(200).send(searchedmovie);
});

//Description: Rate a movie with movie name as input
//Route: POST /api/movie/rate
//access: public
const rateMovies = asyncHandler(async (req, res) => {
  const moviename = req.body.moviename
  const username = req.body.username
  const rating = req.body.rating
  const movie = await Movie.findOne({moviename})

  
  if(movie){

    Movie.updateOne(
      { _id: movie._id },
      { $push: { ratings: [{username, rating}] } },
      function(err) {
        if (err) {
          res.status(404)
          throw new Error(err)
        } else {
          res.status(200).json({message: 'Movie rated successfully' }) 
        }
      }
    );
  }else{

    const movieRatings = await Movie.create({
      moviename,
      ratings:[{
        username,
        rating
      }]
    })
    res.send(movieRatings)
  }
  
});
module.exports = {
 getMovie,
 searchMovie,
 rateMovies,
};
