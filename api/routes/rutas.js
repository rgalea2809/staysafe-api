const express = require('express');
const ruta = require('../models/ruta');
const router = express.Router();
const mongoose = require("mongoose");

router.get('/', (req, res, next) =>{
    ruta
    .find()
    .select('ownerId listeners date startingLatitude startingLongitude endingLatitude endingLongitude _id')
    .exec()
    .then(docs=>{
        const response = {
            count: docs.length,
            rutas: docs.map(doc=> {
                return {
                    ownerId: result.ownerId,
                    listeners: result.listeners,
                    date: result.date,
                    startingLatitude: result.startingLatitude,
                    startingLongitude: result.startingLongitude,
                    endingLatitude: result.endingLatitude,
                    endingLongitude: result.endingLongitude,
                    _id: result._id,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/users/' + doc._id
                    }
                }
            })
        }

        console.log(docs);
        if(docs.length >= 0){
            res.status(200).json(response);
        }else{
            res.status(404).json({message: "No entries found"});
        }
        
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
})

router.post('/', (req, res, next) =>{
    const ruta = {
        _id: new mongoose.Types.ObjectId(),
        ownerId: req.body.ownerId,
        listeners: req.body.listeners,
        date: req.body.date,
        startingLatitude: req.body.startingLatitude,
        startingLongitude: req.body.startingLongitude,
        endingLatitude: req.body.endingLatitude,
        endingLongitude: req.body.endingLongitude,
    };

    ruta
		.save()
		.then((result) => {
			console.log(result);
			res.status(201).json({
				message: "Created Ruta successfully",
				createdProduct: {
                    ownerId: result.ownerId,
                    listeners: result.listeners,
                    date: result.date,
                    startingLatitude: result.startingLatitude,
                    startingLongitude: result.startingLongitude,
                    endingLatitude: result.endingLatitude,
                    endingLongitude: result.endingLongitude,
                    _id: result._id,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/rutas/" + result._id
                    }
                },
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});

router.get('/:rutaId', (req, res, next)=>{
    const id = req.params.rutaId;

	Ruta
    .findById(id)
        .select('ownerId listeners date startingLatitude startingLongitude endingLatitude endingLongitude _id')
		.exec()
		.then((doc) => {
			console.log("From database", doc);
            if(doc){
			res.status(200).json({
                ruta: doc,
                request: {
                    type: "GET",
                    description: "Get single ruta",
                    url: 'http://localhost:3000/rutas'
                }
            });
            }else{
                res.status(400).json({message: "no valid entry found"});
            }
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err });
		});
})


router.delete('/:rutaId', (req, res, next)=>{
    const id = req.params.userId;

	Ruta.remove({_id: id})
    .exec()
    .then(result=>{
        res.status(200).json({
            message: "Ruta Deleted",
            request: {
                type: "DELETE",
                url:"http://localhost:300/rutas",
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: err});
    });
})

module.exports = router;