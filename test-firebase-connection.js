import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBWXDvOhHfz7wwNS2YRxIjJh8rEnn-DWOc",
  authDomain: "profile-167df.firebaseapp.com",
  projectId: "profile-167df",
  storageBucket: "profile-167df.firebasestorage.app",
  messagingSenderId: "29979722821",
  appId: "1:29979722821:web:ee5e2a25c6919d83998f2c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function testFirebaseConnection() {
  console.log("🔥 Testing Firebase Connection...\n");

  try {
    // Test 1: Authentication
    console.log("1. Testing Authentication...");
    const userCredential = await signInWithEmailAndPassword(
      auth,
      "ali@gmail.com",
      "123456"
    );
    console.log("✅ Authentication successful!");
    console.log("User ID:", userCredential.user.uid);
    console.log("Email:", userCredential.user.email);
    console.log("");

    // Test 2: Create a test project
    console.log("2. Testing Project Creation...");
    const testProject = {
      title: "Test Project",
      description: "This is a test project created by the test script",
      imageUrl:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500",
      technologies: ["React", "Firebase", "Test"],
      liveUrl: "https://test.com",
      githubUrl: "https://github.com/test",
      createdAt: new Date(),
      authorId: userCredential.user.uid,
      authorName: userCredential.user.email,
    };

    const projectRef = await addDoc(collection(db, "projects"), testProject);
    console.log("✅ Project created successfully!");
    console.log("Project ID:", projectRef.id);
    console.log("");

    // Test 3: Read projects
    console.log("3. Testing Project Reading...");
    const projectsSnapshot = await getDocs(collection(db, "projects"));
    console.log("✅ Projects read successfully!");
    console.log("Total projects:", projectsSnapshot.size);
    projectsSnapshot.forEach((doc) => {
      console.log(`- ${doc.data().title} (ID: ${doc.id})`);
    });
    console.log("");

    // Test 4: Update project
    console.log("4. Testing Project Update...");
    await updateDoc(doc(db, "projects", projectRef.id), {
      title: "Updated Test Project",
      description: "This project has been updated by the test script",
    });
    console.log("✅ Project updated successfully!");
    console.log("");

    // Test 5: Create a test blog post
    console.log("5. Testing Blog Post Creation...");
    const testBlogPost = {
      title: "Test Blog Post",
      content: "This is a test blog post content created by the test script",
      excerpt: "A test blog post excerpt",
      author: userCredential.user.email,
      tags: ["test", "blog", "firebase"],
      createdAt: new Date(),
      authorId: userCredential.user.uid,
      authorName: userCredential.user.email,
    };

    const blogRef = await addDoc(collection(db, "blog-posts"), testBlogPost);
    console.log("✅ Blog post created successfully!");
    console.log("Blog ID:", blogRef.id);
    console.log("");

    // Test 6: Read blog posts
    console.log("6. Testing Blog Post Reading...");
    const blogSnapshot = await getDocs(collection(db, "blog-posts"));
    console.log("✅ Blog posts read successfully!");
    console.log("Total blog posts:", blogSnapshot.size);
    blogSnapshot.forEach((doc) => {
      console.log(`- ${doc.data().title} (ID: ${doc.id})`);
    });
    console.log("");

    // Test 7: Update blog post
    console.log("7. Testing Blog Post Update...");
    await updateDoc(doc(db, "blog-posts", blogRef.id), {
      title: "Updated Test Blog Post",
      excerpt: "This blog post has been updated by the test script",
    });
    console.log("✅ Blog post updated successfully!");
    console.log("");

    // Test 8: Delete test data
    console.log("8. Cleaning up test data...");
    await deleteDoc(doc(db, "projects", projectRef.id));
    await deleteDoc(doc(db, "blog-posts", blogRef.id));
    console.log("✅ Test data cleaned up successfully!");
    console.log("");

    console.log("🎉 All Firebase tests passed successfully!");
    console.log("✅ Authentication: Working");
    console.log("✅ Firestore CRUD: Working");
    console.log("✅ Admin dashboard should now work properly!");
  } catch (error) {
    console.error("❌ Firebase test failed:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);

    if (error.code === "permission-denied") {
      console.log("\n🔧 To fix this, update your Firestore security rules:");
      console.log("Go to Firebase Console → Firestore Database → Rules");
      console.log("Replace with:");
      console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
      `);
    }
  }
}

testFirebaseConnection();
