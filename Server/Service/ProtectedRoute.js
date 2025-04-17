import jwt from 'jsonwebtoken';
import User from '../Model/User.model.js';

const ProtectedRoute = async (req, res, next) => {
    const { token } = req.cookies;
    try {
        if (!token) {
            return res.status(400).json({ message: 'Token did not found' })
        }
        const decodeUser = jwt.verify(token, process.env.JWTSECRET);
        if (!decodeUser) {
            return res.status(400).json({ message: 'Token must' })
        }
        const user = await User.findOne({ _id: decodeUser.id }).select('-password');
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error })
    }

};
export default ProtectedRoute;