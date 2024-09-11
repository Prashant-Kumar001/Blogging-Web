import jwt from 'jsonwebtoken';
export function setUser(user) {
    const payload = {
        FullName: user.FullName,
        id: user.id,
        email: user.email,
        role: user.role
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
    return token;
}
export function getUser(token) {
    try {
        const user = jwt.verify(token, process.env.SECRET_KEY);
        return user;
    } catch (error) {
        return null;
    }
}

