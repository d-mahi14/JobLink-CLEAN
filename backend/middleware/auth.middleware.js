import { supabase } from '../lib/supabase.config.js';

export const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
    req.supabaseToken = token;
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Middleware to check user type (candidate or company)
export const requireUserType = (allowedTypes) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', userId)
        .single();

      if (error) {
        return res.status(400).json({ message: "Profile not found" });
      }

      if (!allowedTypes.includes(profile.user_type)) {
        return res.status(403).json({ 
          message: `Access denied. This route is only for ${allowedTypes.join(' or ')} users.` 
        });
      }

      req.userType = profile.user_type;
      next();
    } catch (error) {
      console.error("Error in requireUserType:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
};