var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    text: String,
    user: String
});

var postSchema = new mongoose.Schema({
    text: String,
    comments: [commentSchema]
}, { usePushEach: true });

var Post = mongoose.model('Post', postSchema);

module.exports = Post