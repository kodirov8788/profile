"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

interface BlogPost {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  createdAt: Date;
  tags: string[];
}

// Example blog posts for testing when Firebase is not configured
const exampleBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started with Next.js 14",
    content:
      "Next.js 14 introduces several new features including the App Router, Server Components, and improved performance. In this post, we'll explore how to get started with the latest version and build a modern web application.",
    excerpt:
      "Learn how to build modern web applications with Next.js 14 and its new features including the App Router and Server Components.",
    author: "Test User",
    createdAt: new Date("2024-01-10"),
    tags: ["Next.js", "React", "Web Development", "Tutorial"],
  },
  {
    id: "2",
    title: "Mastering TypeScript for React Development",
    content:
      "TypeScript has become an essential tool for React development, providing better type safety and developer experience. This comprehensive guide covers everything you need to know about using TypeScript with React.",
    excerpt:
      "A comprehensive guide to using TypeScript with React for better type safety and developer experience.",
    author: "Test User",
    createdAt: new Date("2024-02-15"),
    tags: ["TypeScript", "React", "JavaScript", "Programming"],
  },
  {
    id: "3",
    title: "Building Responsive UIs with Tailwind CSS",
    content:
      "Tailwind CSS has revolutionized the way we build user interfaces. Learn how to create beautiful, responsive designs using utility-first CSS framework and best practices.",
    excerpt:
      "Learn how to create beautiful, responsive user interfaces using Tailwind CSS utility-first approach.",
    author: "Test User",
    createdAt: new Date("2024-03-05"),
    tags: ["Tailwind CSS", "CSS", "UI/UX", "Design"],
  },
];

const Blog = () => {
  const t = useTranslations("blog");
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [useExampleData, setUseExampleData] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    author: "",
    tags: "",
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "blog-posts"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as BlogPost[];
      setPosts(postsData);
      setUseExampleData(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      // If Firebase fails, show example data for testing
      setPosts(exampleBlogPosts);
      setUseExampleData(true);
      if (currentUser) {
        toast.error(
          "Failed to load blog posts from database, showing example data"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Please sign in to add blog posts");
      return;
    }

    if (useExampleData) {
      toast.error(
        "Cannot add blog posts in demo mode. Please configure Firebase."
      );
      return;
    }

    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
        createdAt: new Date(),
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email,
      };

      if (editingPost) {
        await updateDoc(doc(db, "blog-posts", editingPost.id!), postData);
        toast.success("Post updated successfully");
      } else {
        await addDoc(collection(db, "blog-posts"), postData);
        toast.success("Post added successfully");
      }

      setIsModalOpen(false);
      setEditingPost(null);
      resetForm();
      fetchPosts();
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Failed to save post");
    }
  };

  const handleEdit = (post: BlogPost) => {
    if (!currentUser) {
      toast.error("Please sign in to edit blog posts");
      return;
    }

    if (useExampleData) {
      toast.error(
        "Cannot edit blog posts in demo mode. Please configure Firebase."
      );
      return;
    }

    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      author: post.author,
      tags: post.tags.join(", "),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (postId: string) => {
    if (!currentUser) {
      toast.error("Please sign in to delete blog posts");
      return;
    }

    if (useExampleData) {
      toast.error(
        "Cannot delete blog posts in demo mode. Please configure Firebase."
      );
      return;
    }

    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteDoc(doc(db, "blog-posts", postId));
        toast.success("Post deleted successfully");
        fetchPosts();
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error("Failed to delete post");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      author: "",
      tags: "",
    });
  };

  if (loading) {
    return (
      <section id="blog" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading blog posts...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">{t("title")}</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
          {useExampleData && (
            <div className="mt-4 p-3 bg-yellow-600/20 border border-yellow-600/30 rounded-lg">
              <p className="text-yellow-300 text-sm">
                🔧 Demo Mode: Showing example blog posts. Configure Firebase for
                full functionality.
              </p>
            </div>
          )}
        </motion.div>

        {/* Add Post Button - Only show for authenticated users */}
        {currentUser && !useExampleData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              <PlusIcon className="h-5 w-5" />
              <span>{t("addPost")}</span>
            </button>
          </motion.div>
        )}

        {/* Blog Posts Grid */}
        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-gray-800 rounded-lg p-12">
              <h3 className="text-2xl font-semibold text-white mb-4">
                {currentUser ? "No blog posts yet" : "Blog coming soon"}
              </h3>
              <p className="text-gray-400 mb-6">
                {currentUser
                  ? "Start by adding your first blog post using the button above."
                  : "Sign in to view and manage blog posts."}
              </p>
              {!currentUser && (
                <button
                  onClick={() => (window.location.href = "/en#contact")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                >
                  Get in Touch
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{post.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <button className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">
                      Read More
                    </button>
                    {currentUser && !useExampleData && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id!)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Blog Post Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {editingPost ? "Edit Blog Post" : "Add New Blog Post"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Excerpt
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) =>
                        setFormData({ ...formData, excerpt: e.target.value })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Brief summary of the post..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Content
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Write your blog post content here..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Author
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder={
                        currentUser?.displayName ||
                        currentUser?.email ||
                        "Author name"
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="technology, web development, tutorial"
                      required
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                      {editingPost ? "Update" : "Add"} Post
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setEditingPost(null);
                        resetForm();
                      }}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Blog;
