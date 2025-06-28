# Firebase Firestore Security Rules Setup

## The Problem

You're getting "Missing or insufficient permissions" errors because Firebase Firestore security rules are not properly configured.

## Solution

### 1. Go to Firebase Console

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`profile-167df`)
3. Go to **Firestore Database** in the left sidebar
4. Click on the **Rules** tab

### 2. Update Security Rules

Replace the current rules with these:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write their own data
    match /projects/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.authorId;
      allow create: if request.auth != null;
    }

    match /blog-posts/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.authorId;
      allow create: if request.auth != null;
    }

    // Allow authenticated users to read all data (for admin dashboard)
    match /{document=**} {
      allow read: if request.auth != null;
    }
  }
}
```

### 3. Alternative: More Permissive Rules (for development)

If you want to allow all operations for now (not recommended for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Publish Rules

1. Click **Publish** to save the rules
2. Wait a few minutes for the rules to take effect

### 5. Test

After updating the rules, try using the admin dashboard again. The permission errors should be resolved.

## What These Rules Do

- **`request.auth != null`**: Only authenticated users can access the database
- **`request.auth.uid == resource.data.authorId`**: Users can only edit their own content
- **`allow create: if request.auth != null`**: Any authenticated user can create new content
- **`allow read: if request.auth != null`**: Any authenticated user can read all content

## Security Best Practices

1. **Never use `allow read, write: if true`** in production
2. **Always require authentication** for database access
3. **Validate data** on both client and server side
4. **Use specific rules** for different collections
5. **Test your rules** thoroughly before deploying

## Current Demo Mode

Until you configure the security rules, the admin dashboard will show demo data and display a warning banner. This allows you to see how the interface works without needing Firebase configured.
