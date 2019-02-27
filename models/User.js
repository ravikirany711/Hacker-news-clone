const mongoose=require('mongoose')
const Schema=mongoose.Schema

//Create the Schema
//Inside the schema we pass an object with different video ideas we want
const UserSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },

    date:{
        type:Date,
        default:Date.now
    }

})
//the model is created we are now going to use mongoose.model
mongoose.model('users',UserSchema)  //ideas is the name of the model

//This is our user model