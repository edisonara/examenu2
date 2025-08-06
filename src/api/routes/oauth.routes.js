import { Router } from 'express';
import passport from 'passport';
import {
  googleAuth,
  googleCallback,
  githubAuth,
  githubCallback,
  getCurrentUser,
  logout
} from '../controllers/oauth.controller.js';
import { authSuccess } from '../../config/oauth.config.js';

const router = Router();

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback, authSuccess);

// GitHub OAuth routes
router.get('/github', githubAuth);
router.get('/github/callback', githubCallback, authSuccess);

// Get current user
router.get('/me', 
  passport.authenticate('jwt', { session: false }), 
  getCurrentUser
);

// Logout route
router.post('/logout', 
  passport.authenticate('jwt', { session: false }), 
  logout
);

// Failure route
router.get('/failure', (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL || '/'}?error=auth_failed`);
});

export default router;
