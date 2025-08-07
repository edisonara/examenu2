import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import connectDB from './src/config/db.js';
import authRoutes from './src/api/routes/auth.routes.js';
import taskRoutes from './src/api/routes/task.routes.js';
import oauthRoutes from './src/api/routes/oauth.routes.js';
import { configurePassport, authSuccess } from './src/config/oauth.config.js';

// Configuración de rutas de archivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Configure Passport
configurePassport();

const app = express();

// Enable CORS
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5000',
    'http://127.0.0.1:5000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Configurar el motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'public/static')));

// Middleware para parsear JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware to parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', oauthRoutes);

// OAuth Success Redirect
app.get('/auth/success', (req, res) => {
  console.log('Auth success route hit');
  if (req.user) {
    res.json({
      success: true,
      message: 'Authentication successful',
      user: req.user,
      cookies: req.cookies
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }
});

// OAuth Failure Redirect
app.get('/auth/failure', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'Authentication failed'
  });
});

// Success route for OAuth
app.get('/api/auth/success', (req, res) => {
  if (req.user) {
    res.json({ success: true, user: req.user });
  } else {
    res.status(401).json({ success: false, message: 'Not authenticated' });
  }
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Manejar todas las demás rutas y servir el index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving static files from ${path.join(__dirname, 'public')}`);
});
