var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTION_STRING || 'mongodb://localhost/spacebookDB', function () {
  console.log("DB connection established!!!");
})

var Post = require('./models/postModel');

var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var post1 = new Post({
  text: "hello world",
})
post1.comments.push({ text: "hi shir", user: "david" })
// post1.save()


// You will need to create 5 server routes
// These will define your API:
// 1) to handle getting all posts and their comments
app.get('/posts', function (req, res) {
  Post.find(function (err, data) {
    if (err) throw err;
    res.send(data);
  })
})

// 2) to handle adding a post
app.post('/posts/addpost', function (req, res) {
  var newPost = new Post(req.body);
  newPost.save(function (err, data) {
    if (err) throw err;
    res.send(data);
  })
})

// 3) to handle deleting a post
app.delete('/delete/:postId', function (req, res) {
  Post.findByIdAndRemove(req.params.postId, function (err, data) {
    if (err) throw err;
    res.send(data);
  })
})


app.delete('/delete/:postId/comment/:commentId', function (req, res) {
  Post.findById(req.params.postId, function (err, data) {
    if (err) throw err;
    data.comments.splice(req.params.commentId, 1);
    data.save(function (err) {
      if (err) throw err;
      res.send();
    })
  })
})

// 4) to handle adding a comment to a post
app.post('/comment/:postId', function (req, res) {
  Post.findById(req.params.postId, function (err, data){
    if (err) throw err;
    data.comments.push(req.body);
    data.save(function (err, data) {
      if (err) throw err;
      res.send(data)
    })
  })
});


app.listen(process.env.PORT || '8080', function () {
  console.log("what do you want from me! get me on 8000 ;-)");
});

