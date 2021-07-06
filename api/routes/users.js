const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

//get all users
router.get("/", (req, res, next) => {
	User.find()
		.select("username password _id")
		.exec()
		.then((docs) => {
			const response = {
				count: docs.length,
				users: docs.map((doc) => {
					return {
						username: doc.username,
						password: doc.password,
						email: doc.email,
						phone: doc.phone,
						_id: doc._id,
						request: {
							type: "GET",
							url: "http://localhost:3000/users/" + doc._id,
						},
					};
				}),
			};

			console.log(docs);
			if (docs.length >= 0) {
				res.status(200).json(response);
			} else {
				res.status(404).json({ message: "No entries found" });
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err,
			});
		});
});

//Sign Up New User
router.post("/signup", (req, res, next) => {

    User.find({username: req.body.username}).exec().then(user =>{
        if(user){
            return res.status(409).json({
                message: "Username exists"
            });
        }
    });

	User.find({email: req.body.email}).exec().then(user =>{
        if(user){
            return res.status(409).json({
                message: "Email already registered"
            });
        }
    });


	bcrypt.hash(req.body.password, 10, (error, hash) => {
		if (error) {
			return res.status(500).json({
				error: error,
			});
		} else {
			const user = new User({
				_id: new mongoose.Types.ObjectId(),
				username: req.body.username,
				password: hash,
				email: req.body.email,
				phone: req.body.phone
			});

			user.save()
				.then((result) => {
					console.log(result);
					res.status(201).json({
						message: "Signed user successfully",
						createdUser: {
							username: result.username,
							password: result.password,
							email: result.email,
							phone: result.phone,
							_id: result._id,
							request: {
								type: "GET",
								url:
									"http://localhost:3000/users/" + result._id,
							},
						},
					});
				})
				.catch((err) => {
					console.log(err);
					res.status(500).json({ error: err });
				});
		}
	});
});

//log in an user
router.post("/login", (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(401).json({
                message: "Auth Failed"
            });
        }

        bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
            if(err){
                return res.status(401).json({
                    message: "Auth Failed"
                });
            }

            if(result){

                //Add TOken to Session
                const token = jwt.sign({
                    username: user[0].username,
                    id: user[0]._id
                }, process.env.JWT_KEY, 
                {
                }
                )


                return res.status(200).json({
                    message: "Auth Successful",
                    token: token
                });
            }

            return res.status(401).json({
                message: "Auth Failed"
            });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

// Deprecated Method
router.post("/", (req, res, next) => {
	const user = new User({
		_id: new mongoose.Types.ObjectId(),
		username: req.body.username,
		password: req.body.password,
	});

	user.save()
		.then((result) => {
			console.log(result);
			res.status(201).json({
				message: "Created user successfully",
				createdProduct: {
					username: result.username,
					password: result.password,
					_id: result._id,
					request: {
						type: "GET",
						url: "http://localhost:3000/users/" + result._id,
					},
				},
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});


//Get single User
router.get("/:userId", (req, res, next) => {
	const id = req.params.userId;

	User.findById(id)
		.select("username password _id")
		.exec()
		.then((doc) => {
			console.log("From database", doc);
			if (doc) {
				res.status(200).json({
					user: doc,
					request: {
						type: "GET",
						description: "Get single user",
						url: "http://localhost:3000/products",
					},
				});
			} else {
				res.status(400).json({ message: "no valid entry found" });
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});

//Patch user
router.patch("/:userId", (req, res, next) => {
	const id = req.params.userId;
	const updateOps = {};

	console.log(req.body);

	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value;
		console.log(ops.value);
	}

	User.updateOne({ _id: id }, { $set: updateOps })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: "Updated User",
				request: {
					type: "GET",
					url: "http://localhost:3000/users/" + id,
				},
			});
		})
		.catch((err) => {
			console.log(err);
		});
});

// Delete Single User
router.delete("/:userId", (req, res, next) => {
	const id = req.params.userId;
	User.remove({ _id: id })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: "User Deleted",
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});

module.exports = router;
