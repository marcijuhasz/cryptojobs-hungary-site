const express = require("express");
const bodyParser = require("body-parser")
const {
  json
} = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");


const Schema = mongoose.Schema;
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

//initialize database

const CONNECTION_URL = 'mongodb+srv://chicken-admin:chicken123@cluster0.okhyc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//create db Models


const postSchema = {
  
  title: String,
  content: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Stack'
  },
  authorName: String
};

const Post = mongoose.model("Post", postSchema);

const stackSchema = {
  _id: Schema.Types.ObjectId,
  name: String,
  posts: [postSchema]
};

const Stack = mongoose.model("Stack", stackSchema);



// const Blockchain = new Stack({
//   _id: new mongoose.Types.ObjectId(),
//   name: 'Ethereum'
// });


// Blockchain.save(function (err) {
//   if (err) return handleError(err);
// });


// const story1 = new Post({
//   title: 'Blockchain developer wanted',
//   content: 'searching for a talented developer who can maintain our blockchain infrastructure.',
//   author: Blockchain._id,
//   authorName: Blockchain.name
// });

// story1.save(function (err) {
//   if (err) return handleError(err);
  
//   // that's it!
// });


//routing


app.get("/", function (req, res) {



  Post.find({}, function (err, posts) {



    res.render("home", {

      posts: posts



    });

  })
});

app.post("/",function(req,res,next){


  
  console.log(req.body.stackSearcher);

  Stack.findOne({ name: req.body.stackSearcher}, function (err, stack) {

    if(stack === null){
      res.send("No stack was found, please go back.");
    }
    else{

      let STACK_ID = stack._id;

      

      res.redirect("/stacks/" + STACK_ID);

    }
       
       
    
    
  });

 

});



app.get("/add-stack",function(req,res){
  res.render("addStack");
});


app.post("/add-stack",function(req,res){

  const STACK_NAME = req.body.stackName;


  const CryptoStack = new Stack({
    _id: new mongoose.Types.ObjectId(),
    name: STACK_NAME
  });
  
  
  CryptoStack.save(function (err) {
    if (err) return handleError(err);
  });
  


  res.redirect("/stacks/" + CryptoStack._id);
  

});


app.get("/stacks/:postId",function(req,res){
  
  
  
  console.log(req.params.postId);


  Stack.findById(req.params.postId, function(err,stack){
    
   Post.find({ author: req.params.postId,}, function (err, posts) {
      console.log(stack.name);
      
      res.render("stack",{

        stackName : stack.name, 
        posts: posts

      });
    });

  });




  
  
});






app.get("/compose",function(req,res){

  res.render("compose");

});



app.listen(process.env.PORT || 3000, function () {
  console.log("Server started successfully.");
});