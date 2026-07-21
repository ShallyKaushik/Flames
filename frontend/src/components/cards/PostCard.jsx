import React from 'react';
import { LivePollCard } from './LivePollCard';
import { TextPostCard } from './TextPostCard';
import { ImagePostCard } from './ImagePostCard';

export function PostCard({ post, onUpdatePost, onDeletePost, onEditPost, onOpenComments, onNavigateProfile }) {
  switch (post.type) {
    case 'poll':
      return <LivePollCard post={post} onUpdatePost={onUpdatePost} onDeletePost={onDeletePost} onEditPost={onEditPost} onOpenComments={onOpenComments} onNavigateProfile={onNavigateProfile} />;

    case 'image':
      return <ImagePostCard post={post} onUpdatePost={onUpdatePost} onDeletePost={onDeletePost} onEditPost={onEditPost} onOpenComments={onOpenComments} onNavigateProfile={onNavigateProfile} />;

    case 'text':
    default:
      return <TextPostCard post={post} onUpdatePost={onUpdatePost} onDeletePost={onDeletePost} onEditPost={onEditPost} onOpenComments={onOpenComments} onNavigateProfile={onNavigateProfile} />;
  }
}
