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




const postSchema = {
  
  title: String,
  content: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Girl'
  },
  authorName: String
};

const Post = mongoose.model("Post", postSchema);

const girlSchema = {
  _id: Schema.Types.ObjectId,
  name: String,
  igname: String,
  posts: [postSchema]
};

const Girl = mongoose.model("Girl", girlSchema);



const Maddy = new Girl({
  _id: new mongoose.Types.ObjectId(),
  name: 'Michelle Fleming',
  igname: '@michelle223'
});


Maddy.save(function (err) {
  if (err) return handleError(err);
});


const story1 = new Post({
  title: 'Best sex Royale',
  content: 'yea just bang this bitch',
  author: Maddy._id,
  authorName: Maddy.name
});

story1.save(function (err) {
  if (err) return handleError(err);
  
  // that's it!
});



app.get("/", function (req, res) {



  Post.find({}, function (err, posts) {



    res.render("home", {

      posts: posts



    });

  })
});


app.get("/add-girl",function(req,res){
  res.render("addGirl");
});


app.post("/add-girl",function(req,res){

  const IG_NAME = req.body.igName;


  console.log(IG_NAME);
  


  res.redirect("/");
  

});










app.listen(process.env.PORT || 3000, function () {
  console.log("Server started successfully.");
});