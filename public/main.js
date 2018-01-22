var SpacebookApp = function() {

  var posts = [];

  var $posts = $(".posts");

  function getApi() {
    $.ajax({
      method: "GET",
      dataType: 'json',
      url: 'posts',
      success: function(data) {
        console.log(data);
        posts = data;
        _renderPosts();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
    }
}); 
  }
  getApi();

 

  function _renderPosts() {
    $posts.empty();
    var source = $('#post-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts.length; i++) {
      var newHTML = template(posts[i]);
      console.log(newHTML);
      $posts.append(newHTML);
      _renderComments(i)
    }
  }

  function addPost(newPost) {
    $.ajax({
      type: "POST",
      dataType: "json",
      url: 'posts/addpost',
      data: {
        text: newPost,
        comments: []
      },
      success: function(data) {
        posts.push(data);
        _renderPosts();
      }
    });
  }


  function _renderComments(postIndex) {
    var post = $(".post")[postIndex];
    $commentsList = $(post).find('.comments-list')
    $commentsList.empty();
    var source = $('#comment-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts[postIndex].comments.length; i++) {
      var newHTML = template(posts[postIndex].comments[i]);
      $commentsList.append(newHTML);
    }
  }

  var removePost = function(index) {
    $.ajax ({
      type: "DELETE",
      url: 'delete/' + posts[index]._id,
      success: function(data) {
        getApi();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

  var addComment = function(newComment, postIndex) {
    $.ajax ({
      type: "POST",
      dataType: 'json',
      url: 'comment/' + posts[postIndex]._id,
      data: newComment,
      success: function(data) {
        getApi();
      },
      error: function ( jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    })
  };


  var deleteComment = function(postIndex, commentIndex) {
    $.ajax ({
      type: 'DELETE',
      // url:"/delete/postId/comment/commentId",
      url: '/delete/' + posts[postIndex]._id + '/comment/' + posts[postIndex].comments[commentIndex]._id,
      success: function(data) {
        getApi();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    })
  }

  return {
    addPost: addPost,
    removePost: removePost,
    addComment: addComment,
    deleteComment: deleteComment,
  };
};

var app = SpacebookApp();


$('#addpost').on('click', function() {
  var $input = $("#postText");
  if ($input.val() === "") {
    alert("Please enter text!");
  } else {
    app.addPost($input.val());
    $input.val("");
  }
});

var $posts = $(".posts");

$posts.on('click', '.remove-post', function() {
  var index = $(this).closest('.post').index();;
  app.removePost(index);
});

$posts.on('click', '.toggle-comments', function() {
  var $clickedPost = $(this).closest('.post');
  $clickedPost.find('.comments-container').toggleClass('show');
});

$posts.on('click', '.add-comment', function() {

  var $comment = $(this).siblings('.comment');
  var $user = $(this).siblings('.name');

  if ($comment.val() === "" || $user.val() === "") {
    alert("Please enter your name and a comment!");
    return;
  }

  var postIndex = $(this).closest('.post').index();
  var newComment = { text: $comment.val(), user: $user.val() };

  app.addComment(newComment, postIndex);

  $comment.val("");
  $user.val("");

});

$posts.on('click', '.remove-comment', function() {
  var $commentsList = $(this).closest('.post').find('.comments-list');
  var postIndex = $(this).closest('.post').index();
  var commentIndex = $(this).closest('.comment').index();

  app.deleteComment(postIndex, commentIndex);
});