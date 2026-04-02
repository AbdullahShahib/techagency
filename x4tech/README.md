# X4TECH Portfolio + Admin CMS

A jaw-dropping tech agency portfolio with a full Firebase-powered admin panel.

---

## Stack
- **Frontend**: React 18 + Vite + React Router v6
- **3D**: Three.js (starfield, nebula, mountains, parallax)
- **Admin CMS**: Firebase Firestore + Storage + Auth
- **Rich Text**: React Quill (blog editor)
- **Deployment**: Vercel

---

## Quick Start

```bash
npm install
# Create .env with your Firebase keys (see below)
npm run dev
# → http://localhost:5173
```

---

## Firebase Setup

### 1. Create project
Go to [console.firebase.google.com](https://console.firebase.google.com) → New project → Add web app → copy config.

### 2. Enable services
- **Authentication** → Email/Password
- **Firestore Database** → Production mode
- **Storage** → Default rules

### 3. Create admin user
Authentication → Users → Add user (email + password).

### 4. Create .env in project root

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Firestore security rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 6. Storage security rules
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## Admin Panel Access

```
yoursite.com/admin
```

Log in with the Firebase Auth user you created.

---

## Admin Modules

| Module | Path | What it manages |
|--------|------|-----------------|
| Dashboard | `/admin/dashboard` | Stats overview |
| Projects | `/admin/projects` | CRUD + image upload + tech tags + problem/solution + URLs |
| Services | `/admin/services` | Cards + pricing tiers |
| Testimonials | `/admin/testimonials` | Reviews + star ratings + photos |
| Clients & Cases | `/admin/clients` | Trusted-by logos + case study PDF downloads |
| Team & Jobs | `/admin/team` | Headshots + bios + LinkedIn + hiring toggle + job openings |
| Blog | `/admin/blog` | Rich text editor + SEO per post + scheduling |
| SEO | `/admin/seo` | Meta title/desc + Open Graph + Analytics IDs |
| Settings | `/admin/settings` | Change password + Firebase guide |

---

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Or push to GitHub → import at vercel.com/new.

**Important**: Add all `VITE_FIREBASE_*` env vars in Vercel project settings.

---

## Project Structure

```
src/
  contexts/AuthContext.jsx       Firebase auth provider
  lib/
    firebase.js                  App init
    firestore.js                 CRUD + Storage helpers
  components/
    admin/AdminUI.jsx            Reusable admin primitives
    sections/                    Public website sections
    ui/Cursor.jsx
  pages/admin/
    AdminLogin.jsx
    AdminLayout.jsx              Sidebar shell
    ProtectedRoute.jsx
    AdminDashboard.jsx
    AdminProjects.jsx
    AdminServices.jsx
    AdminTestimonials.jsx
    AdminClients.jsx
    AdminTeam.jsx
    AdminBlog.jsx                Quill rich text
    AdminSEO.jsx
    AdminSettings.jsx
  App.jsx                        Router + all routes
```
