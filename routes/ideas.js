const express=require('express')
const mongoose=require('mongoose')
const router = express.Router() //we need to bring in router from express
const {ensureAuthenticated}=require('../helpers/auth')





//LOAD IDEA MODEL OR SCHEMA
require('../models/Idea')
//load the model in to a variable
const Idea=mongoose.model('ideas')
    



//Idea index page(where the collection is shown)
router.get('/',ensureAuthenticated,(req,res)=>{
    Idea.find({user:req.user.id})
    .sort({date:'desc'})
    .then(ideas=>{
        res.render('ideas/index',{
            ideas:ideas
        })

    })
   
})

//Add Idea form
router.get('/add',ensureAuthenticated,(req,res)=>{
    res.render('ideas/add')
})

//Edit Idea form
router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea=>{
        if(idea.user !=req.user.id){
            req.flash("error_msg","Not Authorized")
            res.redirect('/ideas')

        } else{
            res.render('ideas/edit',{
                idea:idea
            })
        }
       

    })
    
})



//Process form which makes a POST request(once we submit the add news, this is where it will go)
router.post('/',ensureAuthenticated,(req,res)=>{
    // console.log(req.body)
    // res.send('ok')
    let errors=[]
    if(!req.body.title){
        errors.push({text:'Please add a title'})
    }

    if(!req.body.details){
        errors.push({text:'Please add some details'})
    }
    if(errors.length>0){
        //We are gonna re-render the form if there are errors
        res.render('ideas/add',{
            errors:errors,
            title:req.body.title, //we  are giving this because,we want the information to stay
            details:req.body.details
        })
    } else{
        //After clicking the submit
        const newUser={
            title:req.body.title,
            details:req.body.details,
            user: req.user.id
            
        }
        new Idea(newUser)
        .save()
        .then(idea=>{
            req.flash('success_msg','Added successfully')
            res.redirect('/ideas')
        })
    }



})

//Edit form process which is a PUT request
router.put('/:id',ensureAuthenticated,(req,res)=>{
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea=>{
        //we are going to change the values ,these are new values
    idea.title=req.body.title;
    idea.details=req.body.details

    idea.save()
        .then(idea=>{
            req.flash('success_msg','Updated successfully')
            res.redirect('/ideas')
        })

    })
    // res.send('PUT')

})

//Delete Idea
router.delete('/:id',ensureAuthenticated,(req,res)=>{
    // res.send('DELETE')
    Idea.remove({_id:req.params.id})
    .then(()=>{
        req.flash('success_msg','Removed successfully')
        res.redirect('/ideas')
    })

})


module.exports=router; //we are exporting the router
