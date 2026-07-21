import React from 'react';
import { SearchAndFilter } from '../components/SearchAndFilter';
import { CategoryTabs } from '../components/CategoryTabs';
import { PostComposer } from '../components/PostComposer';
import { Feed } from '../components/Feed';

export function HomeView({
  posts,
  isLoading,
  searchQuery,
  onSearchChange,
  activeCategory,
  onSelectCategory,
  onOpenFilter,
  hasActiveFilters,
  onOpenCreateModal,
  onUpdatePost,
  onOpenComments,
  onOpenAnonMsg,
  onResetFilters,
}) {
  return (
    <div className="pb-24 animate-fade-in">
      {/* Search & Filter Row */}
      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onOpenFilter={onOpenFilter}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Horizontal Category Pill Tabs */}
      <CategoryTabs
        activeCategory={activeCategory}
        onSelectCategory={onSelectCategory}
      />

      {/* Post Composer Card */}
      <PostComposer onOpenCreateModal={onOpenCreateModal} />

      {/* Feed List of Cards */}
      <Feed
        posts={posts}
        isLoading={isLoading}
        onUpdatePost={onUpdatePost}
        onOpenComments={onOpenComments}
        onOpenAnonMsg={onOpenAnonMsg}
        onResetFilters={onResetFilters}
      />
    </div>
  );
}
