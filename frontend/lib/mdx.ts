// Re-export from static blog data
// This avoids using fs module which doesn't work in client-side bundled code

export type {
  BlogPost,
} from './blog-data';

export {
  getAllPosts,
  getPostBySlug,
  getAllCategories,
  getAllTags,
  getPostsByCategory,
  getPostsByTag,
  getRelatedPosts,
} from './blog-data';
