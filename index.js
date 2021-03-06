var http = require('http');
require('dotenv').config()
var express = require('express');
var app = express();
var bodyparser =require('body-parser');

app.use(bodyparser.urlencoded({ extended:false }));
app.use(bodyparser.json());

var port= process.env.PORT || 3000; 
console.log(port);

var router=express.Router();

router.get('/',function(req,res){
    res.send('Hello World');
})

// Setting up Routes
var router=express.Router();
employees  = require('./routes/employees.js');
app.use('/employees', employees);

users  = require('./routes/users.js');
app.use('/users', users);

// Create an HTTP service.
http.createServer(app).listen(port);
