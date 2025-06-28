"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "../auth/ProtectedRoute";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FolderIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowLeftIcon,
  UserIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
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
import toast from "react-hot-toast";
import type { FirebaseError } from "firebase/app";

interface Project {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  createdAt: Date;
  authorId?: string;
  authorName?: string;
}

interface BlogPost {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  createdAt: Date;
  tags: string[];
  authorId?: string;
  authorName?: string;
}

type AdminView = "dashboard" | "projects" | "blogs" | "analytics";

// Demo data for when Firebase is not configured
const demoProjects: Project[] = [
  {
    id: "demo-1",
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce platform built with Next.js, TypeScript, and Stripe integration.",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500",
    technologies: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS"],
    liveUrl: "https://demo-ecommerce.com",
    githubUrl: "https://github.com/demo/ecommerce",
    createdAt: new Date("2024-01-15"),
    authorId: "demo-user",
    authorName: "Demo User",
  },
  {
    id: "demo-2",
    title: "Task Management App",
    description:
      "A collaborative task management application with real-time updates and team features.",
    imageUrl:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500",
    technologies: ["React", "Node.js", "Socket.io", "MongoDB"],
    liveUrl: "https://demo-tasks.com",
    githubUrl: "https://github.com/demo/task-app",
    createdAt: new Date("2024-02-20"),
    authorId: "demo-user",
    authorName: "Demo User",
  },
];

const demoBlogPosts: BlogPost[] = [
  {
    id: "demo-blog-1",
    title: "Building Modern Web Applications",
    content:
      "Learn how to build scalable web applications using modern technologies and best practices...",
    excerpt:
      "A comprehensive guide to building modern web applications with React, TypeScript, and Node.js.",
    author: "Demo Author",
    createdAt: new Date("2024-01-10"),
    tags: ["Web Development", "React", "TypeScript"],
    authorId: "demo-user",
    authorName: "Demo Author",
  },
  {
    id: "demo-blog-2",
    title: "Firebase Security Best Practices",
    content:
      "Understanding Firebase security rules and implementing proper authentication and authorization...",
    excerpt:
      "Essential security practices for Firebase applications to protect your data and users.",
    author: "Demo Author",
    createdAt: new Date("2024-02-05"),
    tags: ["Firebase", "Security", "Authentication"],
    authorId: "demo-user",
    authorName: "Demo Author",
  },
];

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const { currentUser } = useAuth();
  const [currentView, setCurrentView] = useState<AdminView>("dashboard");
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [useDemoData, setUseDemoData] = useState(false);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  // Project form state
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    technologies: "",
    liveUrl: "",
    githubUrl: "",
  });
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);

  // Blog form state
  const [blogForm, setBlogForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    author: "",
    tags: "",
  });
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [showBlogModal, setShowBlogModal] = useState(false);

  useEffect(() => {
    if (currentView === "projects") {
      fetchProjects();
    } else if (currentView === "blogs") {
      fetchBlogPosts();
    }
  }, [currentView]);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setFirebaseError(null);
      const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const projectsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Project[];
      setProjects(projectsData);
      setUseDemoData(false);
    } catch (error: unknown) {
      const err = error as FirebaseError;
      console.error("Error fetching projects:", err);
      if (
        err.code === "permission-denied" ||
        (err.message && err.message.includes("permissions"))
      ) {
        setFirebaseError(
          "Firebase permissions not configured. Using demo data."
        );
        setProjects(demoProjects);
        setUseDemoData(true);
        toast.error("Firebase permissions not configured. Using demo data.");
      } else {
        toast.error("Failed to load projects");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      setFirebaseError(null);
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
      setBlogPosts(postsData);
      setUseDemoData(false);
    } catch (error: unknown) {
      const err = error as FirebaseError;
      console.error("Error fetching blog posts:", err);
      if (
        err.code === "permission-denied" ||
        (err.message && err.message.includes("permissions"))
      ) {
        setFirebaseError(
          "Firebase permissions not configured. Using demo data."
        );
        setBlogPosts(demoBlogPosts);
        setUseDemoData(true);
        toast.error("Firebase permissions not configured. Using demo data.");
      } else {
        toast.error("Failed to load blog posts");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (useDemoData) {
      toast.error(
        "Cannot save in demo mode. Please configure Firebase permissions."
      );
      return;
    }

    try {
      const projectData = {
        ...projectForm,
        technologies: projectForm.technologies
          .split(",")
          .map((tech) => tech.trim()),
        createdAt: new Date(),
        authorId: currentUser?.uid,
        authorName: currentUser?.displayName || currentUser?.email,
      };

      if (editingProject) {
        await updateDoc(doc(db, "projects", editingProject.id!), projectData);
        toast.success("Project updated successfully");
      } else {
        await addDoc(collection(db, "projects"), projectData);
        toast.success("Project added successfully");
      }

      setShowProjectModal(false);
      setEditingProject(null);
      setProjectForm({
        title: "",
        description: "",
        imageUrl: "",
        technologies: "",
        liveUrl: "",
        githubUrl: "",
      });
      fetchProjects();
    } catch (error: unknown) {
      const err = error as FirebaseError;
      console.error("Error saving project:", err);
      if (
        err.code === "permission-denied" ||
        (err.message && err.message.includes("permissions"))
      ) {
        toast.error(
          "Firebase permissions not configured. Cannot save project."
        );
      } else {
        toast.error("Failed to save project");
      }
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (useDemoData) {
      toast.error(
        "Cannot save in demo mode. Please configure Firebase permissions."
      );
      return;
    }

    try {
      const blogData = {
        ...blogForm,
        tags: blogForm.tags.split(",").map((tag) => tag.trim()),
        createdAt: new Date(),
        authorId: currentUser?.uid,
        authorName: currentUser?.displayName || currentUser?.email,
      };

      if (editingBlog) {
        await updateDoc(doc(db, "blog-posts", editingBlog.id!), blogData);
        toast.success("Blog post updated successfully");
      } else {
        await addDoc(collection(db, "blog-posts"), blogData);
        toast.success("Blog post added successfully");
      }

      setShowBlogModal(false);
      setEditingBlog(null);
      setBlogForm({
        title: "",
        content: "",
        excerpt: "",
        author: "",
        tags: "",
      });
      fetchBlogPosts();
    } catch (error: unknown) {
      const err = error as FirebaseError;
      console.error("Error saving blog post:", err);
      if (
        err.code === "permission-denied" ||
        (err.message && err.message.includes("permissions"))
      ) {
        toast.error(
          "Firebase permissions not configured. Cannot save blog post."
        );
      } else {
        toast.error("Failed to save blog post");
      }
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (useDemoData) {
      toast.error(
        "Cannot delete in demo mode. Please configure Firebase permissions."
      );
      return;
    }

    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteDoc(doc(db, "projects", projectId));
        toast.success("Project deleted successfully");
        fetchProjects();
      } catch (error: unknown) {
        const err = error as FirebaseError;
        console.error("Error deleting project:", err);
        if (
          err.code === "permission-denied" ||
          (err.message && err.message.includes("permissions"))
        ) {
          toast.error(
            "Firebase permissions not configured. Cannot delete project."
          );
        } else {
          toast.error("Failed to delete project");
        }
      }
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (useDemoData) {
      toast.error(
        "Cannot delete in demo mode. Please configure Firebase permissions."
      );
      return;
    }

    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteDoc(doc(db, "blog-posts", blogId));
        toast.success("Blog post deleted successfully");
        fetchBlogPosts();
      } catch (error: unknown) {
        const err = error as FirebaseError;
        console.error("Error deleting blog post:", err);
        if (
          err.code === "permission-denied" ||
          (err.message && err.message.includes("permissions"))
        ) {
          toast.error(
            "Firebase permissions not configured. Cannot delete blog post."
          );
        } else {
          toast.error("Failed to delete blog post");
        }
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Firebase Error Banner */}
          {firebaseError && (
            <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Firebase Configuration Required
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    {firebaseError} To enable full functionality, configure
                    Firebase Firestore security rules.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                {currentView !== "dashboard" && (
                  <button
                    onClick={() => setCurrentView("dashboard")}
                    className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                  </button>
                )}
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {currentView === "dashboard" && "Admin Dashboard"}
                  {currentView === "projects" && "Manage Projects"}
                  {currentView === "blogs" && "Manage Blog Posts"}
                  {currentView === "analytics" && "Analytics"}
                </h1>
                {useDemoData && (
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-full">
                    Demo Mode
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            {currentView === "dashboard" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* User Info Card */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
                    User Information
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <span className="font-medium">Name:</span>{" "}
                      {currentUser?.displayName || "Not set"}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <span className="font-medium">Email:</span>{" "}
                      {currentUser?.email}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <span className="font-medium">User ID:</span>{" "}
                      {currentUser?.uid}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <span className="font-medium">Email Verified:</span>{" "}
                      {currentUser?.emailVerified ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                {/* Account Stats Card */}
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
                    Account Statistics
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      <span className="font-medium">Created:</span>{" "}
                      {currentUser?.metadata.creationTime
                        ? new Date(
                            currentUser.metadata.creationTime
                          ).toLocaleDateString()
                        : "Unknown"}
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      <span className="font-medium">Last Sign In:</span>{" "}
                      {currentUser?.metadata.lastSignInTime
                        ? new Date(
                            currentUser.metadata.lastSignInTime
                          ).toLocaleDateString()
                        : "Unknown"}
                    </p>
                  </div>
                </div>

                {/* Quick Actions Card */}
                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setCurrentView("projects")}
                      className={`w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
                        useDemoData ? "bg-gray-400 cursor-not-allowed" : ""
                      }`}
                      disabled={useDemoData}
                    >
                      <FolderIcon className="h-4 w-4" />
                      <span>Manage Projects</span>
                    </button>
                    <button
                      onClick={() => setCurrentView("blogs")}
                      className={`w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
                        useDemoData ? "bg-gray-400 cursor-not-allowed" : ""
                      }`}
                      disabled={useDemoData}
                    >
                      <DocumentTextIcon className="h-4 w-4" />
                      <span>Manage Blog Posts</span>
                    </button>
                    <button
                      onClick={() => setCurrentView("analytics")}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <ChartBarIcon className="h-4 w-4" />
                      <span>View Analytics</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentView === "projects" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Manage Projects
                  </h2>
                  <button
                    onClick={() => setShowProjectModal(true)}
                    className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                      useDemoData
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white font-medium transition-colors`}
                    disabled={useDemoData}
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Add Project</span>
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Loading projects...
                    </p>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">
                      No projects found.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                      >
                        <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                          {project.imageUrl && (
                            <img
                              src={project.imageUrl}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {project.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {project.technologies
                              .slice(0, 3)
                              .map((tech, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                                >
                                  {tech}
                                </span>
                              ))}
                            {project.technologies.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                                +{project.technologies.length - 3}
                              </span>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditingProject(project);
                                  setProjectForm({
                                    title: project.title,
                                    description: project.description,
                                    imageUrl: project.imageUrl,
                                    technologies:
                                      project.technologies.join(", "),
                                    liveUrl: project.liveUrl || "",
                                    githubUrl: project.githubUrl || "",
                                  });
                                  setShowProjectModal(true);
                                }}
                                className={`p-2 transition-colors ${
                                  useDemoData
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-blue-600 hover:text-blue-700"
                                }`}
                                disabled={useDemoData}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProject(project.id!)}
                                className={`p-2 transition-colors ${
                                  useDemoData
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-red-600 hover:text-red-700"
                                }`}
                                disabled={useDemoData}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                            <span className="text-xs text-gray-500">
                              {project.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentView === "blogs" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Manage Blog Posts
                  </h2>
                  <button
                    onClick={() => setShowBlogModal(true)}
                    className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                      useDemoData
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white font-medium transition-colors`}
                    disabled={useDemoData}
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Add Blog Post</span>
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Loading blog posts...
                    </p>
                  </div>
                ) : blogPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">
                      No blog posts found.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogPosts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                      >
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
                            {post.excerpt}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {post.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                                +{post.tags.length - 3}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                            <div className="flex items-center space-x-1">
                              <UserIcon className="h-4 w-4" />
                              <span>{post.author}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <CalendarIcon className="h-4 w-4" />
                              <span>{post.createdAt.toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditingBlog(post);
                                  setBlogForm({
                                    title: post.title,
                                    content: post.content,
                                    excerpt: post.excerpt,
                                    author: post.author,
                                    tags: post.tags.join(", "),
                                  });
                                  setShowBlogModal(true);
                                }}
                                className={`p-2 transition-colors ${
                                  useDemoData
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-blue-600 hover:text-blue-700"
                                }`}
                                disabled={useDemoData}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteBlog(post.id!)}
                                className={`p-2 transition-colors ${
                                  useDemoData
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-red-600 hover:text-red-700"
                                }`}
                                disabled={useDemoData}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentView === "analytics" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Analytics Dashboard
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <FolderIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Total Projects
                        </p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {projects.length}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                        <DocumentTextIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Total Blog Posts
                        </p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {blogPosts.length}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <UserIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Account Status
                        </p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                          Active
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {currentView === "dashboard" && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Activity
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    No recent activity to display.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Project Modal */}
        {showProjectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h3>
              {useDemoData && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Demo mode: Changes will not be saved. Configure Firebase to
                    enable full functionality.
                  </p>
                </div>
              )}
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={projectForm.imageUrl}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        imageUrl: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Technologies (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={projectForm.technologies}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        technologies: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="React, TypeScript, Tailwind CSS"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Live URL
                  </label>
                  <input
                    type="url"
                    value={projectForm.liveUrl}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        liveUrl: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={projectForm.githubUrl}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        githubUrl: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className={`flex-1 font-medium py-2 px-4 rounded-md transition-colors ${
                      useDemoData
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white`}
                    disabled={useDemoData}
                  >
                    {editingProject ? "Update" : "Add"} Project
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProjectModal(false);
                      setEditingProject(null);
                      setProjectForm({
                        title: "",
                        description: "",
                        imageUrl: "",
                        technologies: "",
                        liveUrl: "",
                        githubUrl: "",
                      });
                    }}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Blog Modal */}
        {showBlogModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editingBlog ? "Edit Blog Post" : "Add New Blog Post"}
              </h3>
              {useDemoData && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Demo mode: Changes will not be saved. Configure Firebase to
                    enable full functionality.
                  </p>
                </div>
              )}
              <form onSubmit={handleBlogSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={blogForm.title}
                    onChange={(e) =>
                      setBlogForm({ ...blogForm, title: e.target.value })
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
                    value={blogForm.excerpt}
                    onChange={(e) =>
                      setBlogForm({ ...blogForm, excerpt: e.target.value })
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
                    value={blogForm.content}
                    onChange={(e) =>
                      setBlogForm({ ...blogForm, content: e.target.value })
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
                    value={blogForm.author}
                    onChange={(e) =>
                      setBlogForm({ ...blogForm, author: e.target.value })
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
                    value={blogForm.tags}
                    onChange={(e) =>
                      setBlogForm({ ...blogForm, tags: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="technology, web development, tutorial"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className={`flex-1 font-medium py-2 px-4 rounded-md transition-colors ${
                      useDemoData
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white`}
                    disabled={useDemoData}
                  >
                    {editingBlog ? "Update" : "Add"} Post
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBlogModal(false);
                      setEditingBlog(null);
                      setBlogForm({
                        title: "",
                        content: "",
                        excerpt: "",
                        author: "",
                        tags: "",
                      });
                    }}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
