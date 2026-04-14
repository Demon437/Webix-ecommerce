const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Admin access restrict karne ke liye optimized middleware
exports.adminOnly = (req, res, next) => {
    // 1. Check karein ki user authenticated hai ya nahi (protect middleware ke baad use karein)
    // 2. Check karein ki user ka role 'admin' hai
    if (req.user && req.user.role === 'admin') {
        next(); // Agar admin hai toh aage badhne dein
    } else {
        // Agar admin nahi hai toh 403 Forbidden status bhein
        return res.status(403).json({ 
            success: false,
            message: "Access denied. Admin resources only." 
        });
    }
};
