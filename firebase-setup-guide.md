# Firebase Setup Guide

## 🔧 Quick Setup

1. **Create a Firebase Project:**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Name your project (e.g., "portfolio-app")
   - Follow the setup wizard

2. **Enable Authentication:**

   - In Firebase Console, go to "Authentication" → "Sign-in method"
   - Enable "Email/Password" authentication

3. **Enable Firestore Database:**

   - Go to "Firestore Database" → "Create database"
   - Choose "Start in test mode" (for development)
   - Select a location close to you

4. **Get Configuration:**

   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click "Add app" → "Web"
   - Copy the configuration

5. **Create .env.local file:**

   ```bash
   # Create .env.local in your project root
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

6. **Test the connection:**
   ```bash
   node test-firebase-connection.js
   ```

## 🔐 Test Credentials

- Email: `ali@gmail.com`
- Password: `123456`

## 📝 Firestore Security Rules (for development)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // WARNING: Only for development!
    }
  }
}
```

## 🚀 After Setup

1. Run the test script to verify everything works
2. Restart your Next.js development server
3. Sign in with the test credentials
4. Add/edit/delete projects and blog posts
