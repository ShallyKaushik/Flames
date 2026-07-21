import React from 'react';
import { LivePollCard } from './LivePollCard';
import { TextPostCard } from './TextPostCard';
import { ImagePostCard } from './ImagePostCard';

export function PostCard({ post, onUpdatePost, onOpenComments }) {
  switch (post.type) {
    case 'poll':
      return <LivePollCard post={post} onUpdatePost={onUpdatePost} onOpenComments={onOpenComments} />;

    case 'image':
      return <ImagePostCard post={post} onUpdatePost={onUpdatePost} onOpenComments={onOpenComments} />;

    case 'text':
    default:
      return <TextPostCard post={post} onUpdatePost={onUpdatePost} onOpenComments={onOpenComments} />;
  }
}
