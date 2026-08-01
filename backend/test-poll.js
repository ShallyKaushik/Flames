import mongoose from 'mongoose';
import Post from './src/models/post.model.js';

mongoose.connect('mongodb+srv://Flames:qKZJs5VBwBqmxmRq@cluster0.rdawzkd.mongodb.net/flames').then(async () => {
    try {
        const post = await Post.findOne({ 'poll.question': { $exists: true } });
        console.log('Poll Post:', JSON.stringify(post.toObject(), null, 2));
    } catch (e) { console.error(e); }
    process.exit(0);
});
