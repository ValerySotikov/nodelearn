const {Rental, validate} = require('../models/rental');
const auth = require('../middleware/auth');
const {Movie} = require('../models/movie');
const {Customer} = require('../models/customer');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);

router.get('/', async (req, res) => {
  let rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', auth, async (req, res) => {
  let { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = await Customer.findById(req.body.customerId);
  if (!customer) res.status(404).send('Invalid customer');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) res.status(400).send('Invalid movie');

  if (movie.numberInStock === 0) return res.status(400).send('Movie not found');

  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
  
  try {
    new Fawn.Task()
      .save('rentals', rental)
      .update('movies', { _id: movie._id }, {
        $inc: { numberInStock: -1}
      })
      .run();
  } catch (ex) {
    res.status(500).send('Something failed');
  }
  

  res.send(rental);
});

module.exports = router;