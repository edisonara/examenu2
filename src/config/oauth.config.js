import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../domain/models/user.model.js';
import { generateToken } from './jwt.js';

export const configurePassport = () => {
  // Google OAuth 2.0 Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (!user) {
        // Create new user if doesn't exist
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: 'oauth-user', // Will be hashed by pre-save hook
          isOAuth: true
        });
        await user.save();
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));

  // GitHub OAuth 2.0 Strategy
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/api/auth/github/callback",
    scope: ['user:email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // GitHub may return multiple emails, we'll use the primary one
      const primaryEmail = profile.emails.find(email => email.primary) || profile.emails[0];
      
      let user = await User.findOne({ email: primaryEmail.value });
      
      if (!user) {
        // Create new user if doesn't exist
        user = new User({
          name: profile.displayName || profile.username,
          email: primaryEmail.value,
          password: 'oauth-user', // Will be hashed by pre-save hook
          isOAuth: true
        });
        await user.save();
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));

  // Serialize/Deserialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export const authSuccess = (req, res) => {
  const token = generateToken(req.user._id);
  // Redirect to frontend with token
  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
};

export const authFailed = (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
};
