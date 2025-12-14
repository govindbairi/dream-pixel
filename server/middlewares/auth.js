import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.id) {
            return res.status(401).json({ success: false, message: 'Invalid Token. Please Login Again' });
        }

        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
};

export default userAuth;
