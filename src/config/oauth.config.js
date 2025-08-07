import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../domain/models/user.model.js';
import { generateToken } from './jwt.js';

/**
 * Configura las estrategias de autenticación OAuth y JWT
 */
export const configurePassport = () => {
  // Configurar serialización del usuario
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
  
  // Configurar estrategia JWT
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  };
  
  passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }));

  // Verificar si las credenciales de Google están configuradas
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    console.log('Configurando autenticación con Google OAuth');
    
    passport.use(new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
        passReqToCallback: true,
        proxy: true, // Importante para manejar proxies reversos
        scope: ['profile', 'email'],
        accessType: 'offline',
        prompt: 'consent'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No se pudo obtener el correo electrónico del perfil de Google'));
          }
          
          let user = await User.findOne({ email });
          
          if (!user) {
            // Crear nuevo usuario si no existe
            user = new User({
              name: profile.displayName,
              email: email,
              password: 'oauth-user', // Se hasheará automáticamente
              isVerified: true,
              googleId: profile.id
            });
            await user.save();
          }
          
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    ));
  } else {
    console.log('Google OAuth no configurado. Faltan credenciales.');
  }

  // Verificar si las credenciales de GitHub están configuradas
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    console.log('Configurando autenticación con GitHub OAuth');
    
    passport.use(new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/api/auth/github/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
          
          let user = await User.findOne({ 
            $or: [
              { email },
              { githubId: profile.id }
            ]
          });
          
          if (!user) {
            // Crear nuevo usuario si no existe
            user = new User({
              name: profile.displayName || profile.username,
              email: email,
              password: 'oauth-user', // Se hasheará automáticamente
              isVerified: true,
              githubId: profile.id
            });
            await user.save();
          }
          
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    ));
  } else {
    console.log('GitHub OAuth no configurado. Faltan credenciales.');
  }
};

/**
 * Middleware para manejar el éxito de autenticación OAuth
 * Genera un token JWT y redirige al frontend con el token
 */
export const authSuccess = (req, res) => {
  if (!req.user) {
    return res.redirect('/api/auth/failure');
  }
  
  try {
    // Generar token JWT
    const token = generateToken(req.user._id);
    
    // Determinar URL de redirección
    const frontendUrl = process.env.FRONTEND_URL || '/';
    const redirectUrl = `${frontendUrl}?token=${token}`;
    
    // Redirigir al frontend con el token
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error en authSuccess:', error);
    res.redirect('/api/auth/failure');
  }
};

/**
 * Middleware para manejar fallos de autenticación
 */
export const authFailed = (req, res) => {
  res.status(401).json({ success: false, message: 'Error de autenticación' });
};
