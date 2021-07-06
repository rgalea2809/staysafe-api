const express = require('express')
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');


const userRoutes = require('./api/routes/users');
const rutaRoutes = require('./api/routes/rutas');

mongoose.connect("mongodb+srv://galeo:"+ process.env.MONGO_ATLAS_PWD+ "@cluster0.d9nyw.mongodb.net/appdatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err=>{console.log(err)})

mongoose.Promise = global.Promise

app.use(morgan('dev'));
app.use(express.urlencoded({
    extended: false
  }));
app.use(express.json());

app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});


//Routes
app.use('/users', userRoutes);
app.use('/rutas', rutaRoutes);

app.use( (req, res, next) =>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,

        }
    });
});

module.exports = app;