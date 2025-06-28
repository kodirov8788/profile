# Modern Portfolio Website

A beautiful, responsive portfolio website built with Next.js 15, TypeScript, Tailwind CSS, and Firebase. Features internationalization support for Uzbek, English, Russian, and Japanese languages.

## 🌟 Features

- **Multi-language Support**: Uzbek, English, Russian, and Japanese
- **Modern UI/UX**: Beautiful animations with Framer Motion
- **CRUD Operations**: Full Create, Read, Update, Delete functionality for projects and blog posts
- **Firebase Integration**: Real-time database and authentication
- **Responsive Design**: Works perfectly on all devices
- **SEO Optimized**: Built with Next.js App Router
- **TypeScript**: Full type safety
- **Tailwind CSS**: Modern styling with utility classes

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Heroicons
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Internationalization**: next-intl
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd profile
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Firebase**

   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Enable Authentication (optional)
   - Get your Firebase configuration

4. **Environment Variables**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌍 Internationalization

The website supports four languages:

- **Uzbek** (default): `/uz`
- **English**: `/en`
- **Russian**: `/ru`
- **Japanese**: `/ja`

Translation files are located in the `messages/` directory.

## 📁 Project Structure

```
src/
├── app/
│   ├── [locale]/          # Internationalized routes
│   │   ├── layout.tsx     # Locale-specific layout
│   │   └── page.tsx       # Main page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Root page (redirects)
├── components/            # React components
│   ├── Navigation.tsx     # Navigation with language switcher
│   ├── Hero.tsx          # Hero section
│   ├── About.tsx         # About section
│   ├── Projects.tsx      # Projects with CRUD
│   ├── Blog.tsx          # Blog with CRUD
│   └── Contact.tsx       # Contact form
├── lib/
│   └── firebase.ts       # Firebase configuration
├── i18n.ts               # Internationalization config
└── middleware.ts         # Next.js middleware
```

## 🔥 Firebase Setup

1. **Create Collections**
   The app uses these Firestore collections:

   - `projects`: For portfolio projects
   - `blog-posts`: For blog posts
   - `contacts`: For contact form submissions

2. **Security Rules**
   Set up appropriate Firestore security rules for your use case.

## 🎨 Customization

### Colors and Styling

- Modify `tailwind.config.js` for custom colors and theme
- Update component styles in individual component files

### Content

- Update translation files in `messages/` directory
- Modify component data (skills, experience, etc.) in component files
- Update contact information in `Contact.tsx`

### Firebase

- Update Firebase configuration in `src/lib/firebase.ts`
- Modify Firestore collections and fields as needed

## 📱 Responsive Design

The website is fully responsive and optimized for:

- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1280px+)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the maintainer

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Firebase](https://firebase.google.com/) for the backend services
- [Heroicons](https://heroicons.com/) for the beautiful icons
