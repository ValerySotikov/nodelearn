const validateObjectId = require('../middleware/validateObjectId');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const express = require('express');
const {Genre, validate} = require('../models/genre');
const router = express.Router();
const MSG404 = 'The genre with the given ID was not found';
const mongoose = require('mongoose');


router.get('/', async (req, res, next) => {
    // throw new Error('Something failed');
    let genres = await getGenres();
    res.send(genres);
});


router.get('/:id', validateObjectId, async (req, res) => {
    let result = await getSingleGenre( req.params.id );
    if (!result) return res.status(404).send(MSG404);
    res.send(result);
});


router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let result = await putGenre( req.params.id, req.body.name );
    if (!result) return res.status(404).send(MSG404);
    res.send(result);
});


router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let result = await postGenre(req.body.name);
    res.send(result);
});


router.delete('/:id', [auth, admin], async (req, res) => {
    let result = deleteGenre(req.params.id);
    if (!result) return res.status(404).send(MSG404);
    res.send(result);
});


async function getSingleGenre(id) {
    let result = await Genre.findById(id);
    return result;
}


async function getGenres() {
    let genres = await Genre.find().sort('name');
    return genres;
}


async function putGenre(id, title) {
    let genre = await Genre.findByIdAndUpdate(id, {name: title}, {new: true});

    let result = await genre.save();
    return result;
}


async function postGenre(title) {
   const genre = new Genre({ name: title });

    try {
        await genre.save();
        return genre;
    } catch (ex) {
        for (field in ex.errors)
            console.log(ex.errors[field].message);
    }
}


async function deleteGenre(id) {
    let result = await Genre.findByIdAndRemove(id);
    return result;
}


module.exports = router;