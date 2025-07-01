// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    // If the user is not an admin, deny access with status 403 (Forbidden)
    if (!req.user?.isAdmin) {
        return res.status(403).send({ message: 'Access denied. Admins only.' });
    }
    // If user is admin, proceed to the next middleware or route handler
    next();
};

export default isAdmin;
