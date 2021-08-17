var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('dotenv').config()

let url = process.env.URL

const database = mongoose.createConnection(url, {useNewUrlParser: true, useUnifiedTopology: true});


const EmployeeSchema=new mongoose.Schema({
    name: {
      type:String,
      required:true    
    },
    email:{
      type:String,
      required:true
    },
    contact:{
      type:String,
      required:true
    },
    serial_no:{
      type:Number,
      required:true
    },
    created_at:{
      type:Date,
      default: Date.now()
    }
},
{
    versionKey: false,
    collection: 'employees'
})

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  currency : {
    type : String,
    required : true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
}, 
{ 
  collection: 'users' 
});


//Create Model with Schema Reference
var Employee = database.model('Employee',EmployeeSchema);
var User = database.model('User',UserSchema);

module.exports = {
    Employee,
    User
};
