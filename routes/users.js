const express = require('express');
const jwt = require('jsonwebtoken');
var bodyparser =require('body-parser');
let Validator = require('validatorjs');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const mongoose = require('mongoose');
const models = require("../models");

const User = models.User;

const app = express();

var router=express.Router();

// Body Parser for Post Request
app.use(bodyparser.json());


router.post('/register',async (req,res)=>{

  try
  {
      let user = req.body;

      //==============================ADDING VALIDATION START===================================//

      let rules = {
        email: 'required',
        password: 'required',
        expiry:'required',
        currency:'required',
      };

      let validation = new Validator(user,rules);

      if(validation.fails()){
        res.json(validation.errors.all());
        return false;
      }
           
      //==============================ADDING VALIDATION END===================================//


          let pass = await bcrypt.hash(user.password, saltRounds);

          await User.create({
            'username':user.username,
            'email':user.email,
            'password':pass,
            'company':user.company,
            'currency':user.currency
          })

          res.json({
            ...user
          });
  }
  catch (e)
  {
      console.log(e);
  }
});

router.post('/login',async (req,res)=>{

    let user = req.body;

    //==============================ADDING VALIDATION START===================================//

      let rules = {
        email: 'required',
        password: 'required'
      };

      let validation = new Validator(user,rules);

      if(validation.fails()){
        res.json(validation.errors.all());
        return false;
      }
           
      //==============================ADDING VALIDATION END===================================//

    let user_data = await User.findOne({ 
      email: user.email
    })

    let passwordIsValid = bcrypt.compareSync(user.password, user_data.password);

    if(passwordIsValid)
    {
        jwt.sign({user: user_data},'secretkey',{
          expiresIn: '1h'
        },(err,token)=>{
          res.json({
            token
          });
        });
    }
    else
    {
        res.send({
            'error':true,
            'response':'Authentication Failed'
        });

        return false;
    }
});


router.post('/time/remaining',verifyToken,(req,res)=>{

    jwt.verify(req.token,'secretkey',(err,authData)=>{

      console.log(err);

          if(err)
          {
             res.send({
                'error':true,
                'response':'Your time has expired'
             });
          }
          else
          {
             let unix_timestamp = authData.exp;
             var date = new Date(unix_timestamp * 1000);
             var hours = date.getHours();
             var minutes = "0" + date.getMinutes();
             var seconds = "0" + date.getSeconds();
             var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

             authData.expires_at = formattedTime;
             delete authData.iat;
             delete authData.exp;
             res.json({
                message:'The time remainging.',
                authData
             });
          }
    })
});

// Verify Token

function verifyToken(req,res,next)
{  
	const bearerHeader = req.headers['authorization'];

	if(typeof bearerHeader !=='undefined')
	{
       const bearer = bearerHeader.split(' ');
       const bearertoken = bearer[1];
       req.token = bearertoken;
       next();
	}
	else
	{
	   console.log('send error');
     res.status(403);
     res.send({
        'error':true,
        'response':'Forbidden'
     });
	}
}

module.exports = router;