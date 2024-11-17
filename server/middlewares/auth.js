import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: "Authorization header missing" });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Token is invalid or malformed" });

      req.userId = decoded.id; // Assuming `id` is the property in the payload
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export default auth