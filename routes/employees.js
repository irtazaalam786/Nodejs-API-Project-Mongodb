var express = require('express');
var app = express();
const mongoose = require('mongoose');

//Seting up models
const models = require("../models.js");
const Employee = models.Employee;

// Body Parser for Post Request
var bodyparser =require('body-parser');
const urlencoded_parser = bodyparser.urlencoded({extended:false});

var router=express.Router();

//Setting up validation
const { check, validationResult } = require('express-validator');

let validations = [
   check('email',"This email is not valid")
   .isEmail()
   .normalizeEmail()
   .custom((value, {req}) => {
      return new Promise((resolve, reject) => {

          if(req.body._id)
          {
              resolve(true);
          } 

          Employee.findOne({email:req.body.email}, function(err, user){
                if(err) 
                  reject(new Error('Server Error'));
                console.log('user',user);
                if(user){
                  reject(new Error('E-mail already in use'));
                }
                
                resolve(true);
          });
            
      });
    }),
   check('name',"This name must be 3+ characters long")
   .exists()
   .isLength({min:3})
]

router.delete('/delete/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.send({
                'status':true,
                'response':'Data has been Deleted',
            });
        }
    });
});

router.post('/create',urlencoded_parser,validations, (req, res) => {
    let errors = validationResult(req);
    console.log(errors.mapped());
    errors = errors.mapped();

    console.log(Object.keys(errors).length);

    if(Object.keys(errors).length > 0)
    {
    	return res.send({
            status:false,
	    	    errors:errors
	    });
    }

    console.log(req.body);
    

    var employee = new Employee(req.body);
    employee.save((err, doc) => {
         if(!err)
         {
            res.send({
                'status':true,
                'response':'Data has been Inserted',
                'data': employee
            });
         }
         else
         {
            console.log(err);
         }
    });
});

router.put('/update',urlencoded_parser,validations, (req, res) => {
    let errors = validationResult(req);
    console.log(errors.mapped());
    errors = errors.mapped();

    console.log(Object.keys(errors).length);

    if(Object.keys(errors).length > 0)
    {
      return res.send({
            status:false,
            errors:errors
      });
    }

    console.log(req.body);
    
    var employee = Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) 
        { 
            res.send({
                'status':true,
                'response':'Data has been Updated',
                'data': doc
            });
        }
    });
});

router.get('/', (req, res) => {
    Employee.find((err, docs) => {
        if (!err) {
        	console.log('docs',docs)
            res.send({
                'status':true,
                'response':'Data has been Found',
                'data': docs
            });
        }
    });
});

router.get('/:id', (req, res) => {
    console.log('clicked');
    Employee.findOne({ _id:new mongoose.mongo.ObjectId(req.params.id) },(err, doc) => {
        if (!err) {
          console.log('doc',doc)
            res.send({
                'status':true,
                'response':'Data has been Found',
                'data': doc
            });
        }
        else
        {
           res.send({
                'status':false,
                'response':'Data has not been Found',
            });
        }
    });
});


module.exports = router;