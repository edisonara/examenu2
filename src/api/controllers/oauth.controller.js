import passport from 'passport';
import jwt from 'jsonwebtoken';

// Google OAuth
const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
  accessType: 'offline',
  prompt: 'consent'
});

const googleCallback = (req, res, next) => {
  console.log('Google callback hit');
  
  passport.authenticate('google', { 
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=auth_failed`
  }, (err, user, info) => {
    if (err) {
      console.error('Google OAuth error:', err);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=auth_failed`);
    }
    
    if (!user) {
      console.error('Google OAuth failed:', info);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=auth_failed`);
    }
    
    try {
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Create redirect URL with token and user data
      const redirectUrl = new URL(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/oauth-callback`);
      redirectUrl.searchParams.append('token', token);
      redirectUrl.searchParams.append('user', JSON.stringify({
        id: user._id,
        name: user.name,
        email: user.email,
        isOAuth: true,
        provider: 'google'
      }));
      
      console.log('Redirecting to:', redirectUrl.toString());
      return res.redirect(redirectUrl.toString());
    } catch (error) {
      console.error('Error generating token or redirecting:', error);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=server_error`);
    }
  })(req, res, next);
};

// GitHub OAuth
const githubAuth = passport.authenticate('github', {
  scope: ['user:email']
});

const githubCallback = (req, res, next) => {
  console.log('GitHub callback hit');
  
  passport.authenticate('github', { 
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=auth_failed`
  }, (err, user, info) => {
    if (err) {
      console.error('GitHub OAuth error:', err);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=auth_failed`);
    }
    
    if (!user) {
      console.error('GitHub OAuth failed:', info);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=auth_failed`);
    }
    
    try {
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Create redirect URL with token and user data
      const redirectUrl = new URL(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/oauth-callback`);
      redirectUrl.searchParams.append('token', token);
      redirectUrl.searchParams.append('user', JSON.stringify({
        id: user._id,
        name: user.name || user.username,
        email: user.email,
        isOAuth: true,
        provider: 'github'
      }));
      
      console.log('Redirecting to:', redirectUrl.toString());
      return res.redirect(redirectUrl.toString());
    } catch (error) {
      console.error('Error generating token or redirecting:', error);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=server_error`);
    }
  })(req, res, next);
};

const getCurrentUser = (req, res) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.error('JWT verification error:', err);
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }
      
      // Get user from database
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isOAuth: user.isOAuth || false,
          provider: user.provider || 'local'
        }
      });
    });
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const logout = (req, res) => {
  try {
    // Clear any session data
    if (req.session) {
      req.session.destroy();
    }
    
    // Clear cookies
    res.clearCookie('connect.sid');
    res.clearCookie('jwt');
    
    res.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error during logout' 
    });
  }
};

export {
  googleAuth,
  googleCallback,
  githubAuth,
  githubCallback,
  getCurrentUser,
  logout
};
