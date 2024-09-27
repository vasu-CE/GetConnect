const jwt = require('jsonwebtoken');

const isAuthenticate = (req, res, next) => {
    const jwtSecret = "sdfgfdge";
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: 'User not authenticated',
                success: false
            });
        }
        const decode = jwt.verify(token, jwtSecret);
        req.id = decode.userId;
        next();
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false
        });
    }
}

module.exports = isAuthenticate;
