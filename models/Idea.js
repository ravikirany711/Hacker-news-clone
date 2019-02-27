const mongoose=require('mongoose')
const Schema=mongoose.Schema

//Create the Schema
//Inside the schema we pass an object with different video ideas we want
const IdeaSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    details:{
        type:String,
        required:true
    },
    user:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }

})
//the model is created we are now going to use mongoose.model
mongoose.model('ideas',IdeaSchema)  //ideas is the name of the model