# Fullstack MERN Blogging Website

This is a Fullstack MERN Blogging Website project. Follow the [YouTube tutorial](https://youtu.be/J7BGuuuvDDk?si=7RmyKdIl9bTGoBum) to build this project step-by-step.

## Project Overview

### Features:

1. **Modern Blog Editor**: Built using Editor JS.
2. **Google Authentication**: Secure login for users.
3. **Dynamic Blog Pages**: Blogs accessible via dynamic URLs.
4. **Search Functionality**: Search blogs and users.
5. **User Profiles**: Dedicated profiles with social links and written blogs.
6. **Dashboard**: Manage blogs (published or drafts).
7. **Blog Analytics**: View, edit, and delete blog posts.
8. **Interactions**: Like blogs, comment, and reply to comments (nested comment system).
9. **Notifications**: Real-time notifications for user interactions.
10. **Profile Management**: Update social links, bio, username, and password.
11. **Responsive Design**: Mobile-friendly with modern design and animations.

### Demo

Check out the [Demo](https://youtu.be/J7BGuuuvDDk).

---

## Setup Instructions

### Prerequisites:

1. **Firebase Project**: Set up your Firebase project.
2. **MongoDB Cluster**: Configure your MongoDB cluster.
3. **AWS S3**: Set up AWS S3 for file storage.

### Environment Variables:

#### Frontend (`frontend/.env`):

```
VITE_SERVER_DOMAIN=http://localhost:3000
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_AUTH_DOMAIN=""
VITE_FIREBASE_PROJECT_ID=""
VITE_FIREBASE_STORAGE_BUCKET=""
VITE_FIREBASE_MESSAGING_SENDER_ID=""
VITE_FIREBASE_APP_ID=""
VITE_FIREBASE_MEASUREMENT_ID=""
```

#### Backend (`backend/.env`):

```
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
# Suppress AWS JS v2 warning
# AWS_SDK_JS_SUPPRESS_MAINTENANCE_NODE_MESSAGE='1'
```

---

### Running the Project:

1. **Frontend**:

   ```bash
   cd frontend
   npm run dev
   ```

2. **Backend**:

   ```bash
   cd backend
   npm start
   ```

3. Open your browser and navigate to: [http://localhost:5173](http://localhost:5173)

---

## Progress Log

- **19-02-2025**: Stopped following the playlist at part-4 (2:02:52 hours). More updates to this repository coming soon.

---
