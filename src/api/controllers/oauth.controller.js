import passport from 'passport';

export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

export const googleCallback = passport.authenticate('google', {
  session: false,
  failureRedirect: '/api/auth/failure'
});

export const githubAuth = passport.authenticate('github', {
  scope: ['user:email']
});

export const githubCallback = passport.authenticate('github', {
  session: false,
  failureRedirect: '/api/auth/failure'
});

export const getCurrentUser = (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        isOAuth: req.user.isOAuth,
        provider: req.user.provider
      }
    });
  } else {
    res.status(401).json({ success: false, message: 'Not authenticated' });
  }
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error during logout' });
    }
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.json({ success: true, message: 'Logged out successfully' });
  });
};
