import { getUser } from '../service/auth.js';
import Blog from '../model/blog.model.js';
export function cookieCheckHandler() {
    return async (req, res, next) => {
        const tokenCookie = req.cookies.token;
        if (!tokenCookie) {
            return next();
        }
        try {
            const user = await getUser(tokenCookie);
            req.user = user;
            next();
        } catch (error) {
            next();
        }
    }
}

export function restriction(allowedRoles = []) {
    return (req, res, next) => {
        if (!req.user) {
            // console.log('User not logged in');
            return res.redirect('/login');
        }
        if (!allowedRoles.includes(req.user.role)) {
            // console.log('User not authorized');
            return res.render('unauthorized');
        }
        next();
    }
}
