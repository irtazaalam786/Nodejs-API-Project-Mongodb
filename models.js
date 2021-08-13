var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('dotenv').config()

let url = process.env.URL

const database = mongoose.createConnection(uk_server, {useNewUrlParser: true, useUnifiedTopology: true, auth : { authSource : 'admin' }});


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
    collection: 'employees'
})

//Create Model with Schema Reference
var Employee = database.model('Employee',EmployeeSchema);

module.exports = {
    Employee
};
