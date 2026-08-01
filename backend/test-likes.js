import mongoose from 'mongoose';
import Like from './src/models/like.model.js';
import Post from './src/models/post.model.js';
import { populateUserLikesForPosts } from './src/utils/populateLikes.js';

mongoose.connect('mongodb+srv://Flames:qKZJs5VBwBqmxmRq@cluster0.rdawzkd.mongodb.net/flames').then(async () => {
    try {
        const like = await Like.findOne({});
        console.log('Sample Like:', like);
        if (like) {
            const post = await Post.findById(like.post);
            console.log('Post from DB:', post._id, post.title);
            
            const pop = await populateUserLikesForPosts([post.toObject()], like.user);
            console.log('Populated Post likes array:', pop[0].likes);
        }
    } catch (e) { console.error(e); }
    process.exit(0);
});
