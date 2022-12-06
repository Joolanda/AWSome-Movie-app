const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Models = require('./models.js');
const cors = require('cors');
const { check, validationResult } = require('express-validator');
// hosting client on heroku together with api: const path = require('path');
const path = require('path');
const app = express();
//call dotenv
require('dotenv').config();

// testing connection mongodb
console.log(process.env);

// MongoDB connections
//connecting local db
/* mongoose.connect('mongodb://127.0.0.1:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true }); 
*/
//connecting cloud mongo using heroku
mongoose.connect(process.env.MONGODB_URI, 
    { useNewUrlParser: true, 
     useUnifiedTopology: true,
     useCreateIndex: true, })
     .then(() => {
        console.log("Successfully connected to MongoDB Atlas!");
      })
      .catch((error) => {
        console.log("Unable to connect to MongoDB Atlas!");
        console.error(error);
      });
              
//for connecting to mongoDB
const Movies = Models.Movie;
const Users = Models.User;

//serving static content
app.use(express.static('public'));

// Prepare for hosting on Heroku together with api
app.use('/client', express.static(path.join(__dirname, 'client', 'dist'))); 

//logging using morgan 
app.use(morgan('common'));

//error handling
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());

//for allowing app access from by others 
const allowedOrigins = ['http://localhost:3000', 'http://localhost:8080', 'https://awesome-movie.herokuapp.com', 'https://awesome-movie.herokuapp.com/login','http://localhost:1234'];
app.use(cors({
    origin: (origin, callback) => {
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            //if specified origin isn't found on the list of allowed origins
            let message = `The CORS policy for this application doesn't allow access from origin ${origin}`;
            return callback(new Error(message), false); 
        }
        return callback(null, true);
    }
}));

//auth module requires body parser
const passport = require('passport');
app.use(passport.initialize())
let auth = require('./auth')(app);
require('./passport');

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error has occured!');
})
// before client 
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Listening on Port ${port}`);
})

//API endpoints start
app.get('/', (req, res) => {
    res.send("Welcome to my CloudFlix API !!!");
});
// hosting client on heroku together with api:
app.get('/client/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Return a list of ALL movies to the user
//commented for frontend exercise
app.get('/movies', passport.authenticate('jwt', { session: false }),  (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(200).json(movies)
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(`Error: ${err}`);
        });
});

// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
app.get('/movies/:Title', passport.authenticate('jwt',{ session: false }), (req, res) => {
    Movies.findOne({ Title: req.params.Title})
        .then((movie) => {
            res.status(200).json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(`Error: ${err}`);
        });
});

// Return data about a genre (description) by name/title (e.g., “Thriller”)
app.get('/movies/Genre/:Name', passport.authenticate('jwt',{ session: false }), (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.Name})
    .then((genre)=>{
        res.status(200).json(genre);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
    });
});

// Return data about a director (bio, birth year, death year) by name
app.get('/movies/Director/:Name', passport.authenticate('jwt',{ session: false }), (req, res) => {
    Movies.findOne({ "Director.Name": req.params.Name})
    .then((director)=>{
        res.status(200).json(director);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
    });
});
// GET all users (For testing sake only !!
app.get("/users", (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
    }
  );
// Allow new users to register
app.post('/users', 
        [
            check('Username', 'Username is required').not().isEmpty(),
            //check('Username', 'Username must contain atleast 5 characters').isLength({min: 5}),
            check('Username', 'Username must contain alphanumeric characters').isAlphanumeric(),
            check('Password', 'Password is required').not().isEmpty(),
            check('Email', 'Email is not valid').isEmail(),
        ], 
        (req, res) => {
            let errors = validationResult(req);

            if(!errors.isEmpty()){
                return res.status(422).json({errors: errors.array()});
            }

            const { Username, Password, Email, Birthday } = req.body;
            const hashedPassword = Users.hashPassword(Password);

            // Search to see if a user with the requested username already exists
            Users.findOne({Username: Username})
            .then((user) => {
                //If the user is found, send a response that it already exists
                if(user) {
                    return res.status(400).send(`${Username} already exists`);
                }else{
                    Users.create({
                        Username,
                        Password: hashedPassword,
                        Email,
                        Birthday
                    })
                    .then((user) => {
                        res.status(201).json(user);
                    })
                    .catch((err) => {
                        console.error(err);
                        res.status(500).send(`Error: ${err}`);
                    });
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send(`Error: ${err}`);
            });
        });

// Allow users to update their user info (username)
app.put('/users/:Username',
        passport.authenticate('jwt', { session: false }), 
        [
            check('Username', 'Username is required').not().isEmpty(),
            check('Username', 'Username must contain atleast 5 characters').isLength({min: 5}),
            check('Username', 'Username must contain alphanumeric characters').isAlphanumeric(),
            check('Password', 'Password is required').not().isEmpty(),
            check('Password', 'Password must contain atleast 5 characters').isLength({min: 5}),
            check('Email', 'Email is not valid').isEmail(),
        ], 
        (req, res) => {
            let errors = validationResult(req);

            if(!errors.isEmpty()){
                return res.status(422).json({errors: errors.array()});
            }

            const { Username, Password, Email, Birthday } = req.body;
            const hashedPassword = Users.hashPassword(Password);

            Users.findOneAndUpdate(
                {Username : req.params.Username},
                {
                    $set: { 
                        Username,
                        Password : hashedPassword,
                        Email,
                        Birthday
                    }
                },
                { new: true },
                (err, updatedUser) => {
                    if(err){
                        console.error(err);
                        res.status(500).send(`Error: ${err}`);
                    }
                    else{
                        res.status(200).json(updatedUser);
                    }
                }
            );
        });

// Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later)
app.post('/users/:Username/movies/:_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const {Username, MovieID} = req.params;

    Users.findOneAndUpdate(
        { Username },
        {
            $push: { FavoriteMovies: MovieID }
        },
        { new: true },
        (err, updatedUser) => {
            if(err){
                console.error(err);
                res.status(500).send(`Error: ${err}`);
            }
            else{
                res.status(200).json(updatedUser);
            }
        }
    );
});

// Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later)
app.delete('/users/:Username/movies/:_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const {Username, MovieID} = req.params;

    Users.findOneAndUpdate(
        { Username },
        {
            $pull: { FavoriteMovies: MovieID }
        },
        { new: true },
        (err, updatedUser) => {
            if(err){
                console.error(err);
                res.status(500).send(`Error: ${err}`);
            }
            else{
                res.status(200).json(updatedUser);
            }
        }
    );
});

// Allow existing users to deregister (showing only a text that a user email has been removed—more on this later)
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { Username } = req.params;

    Users.findOneAndRemove({Username: Username})
    .then((user) => {
        if(!user){
            res.status(400).send(`${Username} was not found`);
        }else{
            res.status(200).send(`${Username} was deleted.`);
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
    });
});

// app.listen(3000, () => {
//    console.log('Server started on port 3000');
//});