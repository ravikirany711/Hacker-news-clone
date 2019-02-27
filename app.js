const express=require('express')
const path=require('path')
const exphbs  = require('express-handlebars');
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const methodOverride = require('method-override')
const flash=require('connect-flash')
const passport=require('passport')
const session=require('express-session')


const app=express() //express initialized

//Load routes(since we have exported it , we can bring it here)
const ideas=require('./routes/ideas')
const users=require('./routes/users')

//passport config
require('./config/passport')(passport);



//Map global promise-get rid of warning
mongoose.Promise=global.Promise


//CONNECT TO MONGOOSE
mongoose.connect('mongodb://localhost/Hacker-news',{          //vidjot.dev
    useMongoClient:true //If we dont do this, we get a warning
}) 
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err))







//Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//Body-Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Static folder
app.use(express.static(path.join(__dirname,'public')))

//Method-Override Middleware
app.use(methodOverride('_method'))

//Express-session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    
  }))

//Passport-session middleware
app.use(passport.initialize());
app.use(passport.session());


 //Connect flash using here
 app.use(flash())

//Global variables(This is just another middleware)
app.use(function(req,res,next){
    res.locals.success_msg=req.flash('success_msg')
    res.locals.error_msg=req.flash('error_msg')
    res.locals.error=req.flash('error')
    res.locals.user=req.user || null
    next()

})










//Index route(Literally your home(page) route)
app.get('/',(req,res)=>{
   const title='Welcome';
    res.render('index',{
        title: title
    })
    
})

//About route
app.get('/about',(req,res)=>{
    res.render('about')
})





//Use routes which we exported
app.use('/ideas',ideas)

app.use('/users',users)





app.listen(4000,(req,res)=>{
    console.log(`server started on port 4000`)
})