//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose")
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const { forEach } = require("lodash");

//Connect to database
mongoose.connect("mongodb://localhost:27017/blog")

const homeStartingContent = "Welcome to the blog! Here, you can see recent posts!";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Create table schema
const postSchema = {
  title: String,
  content: String
}

//Create table object
const Post = mongoose.model("Post", postSchema)


app.get("/", function(req, res){

  Post.find({}, function(err, postList){
    if(!err){
      res.render("home", {
        startingContent: homeStartingContent,
        posts: postList
        });
    }
  })
  
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const title = req.body.postTitle
  const content = req.body.postBody

  const post = new Post({
    title: title,
    content: content
  })
      
  post.save()

  res.redirect("/");

});

app.get("/posts/:postID", function(req, res){
  const requestedID = req.params.postID;

  Post.findOne({_id: requestedID}, function(err, post){
    if(!err){
      
      res.render("post", {
        title: post.title,
        content: post.content
      });
      
    }else{
      console.log(err);
    }
 
 
  })

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
