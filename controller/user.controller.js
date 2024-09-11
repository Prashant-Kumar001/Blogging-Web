import person from '../model/user.model.js';
import blog from '../model/blog.model.js';
import bcrypt from 'bcrypt';
import { setUser } from '../service/auth.js';
// these are the static routers 
export async function ShowHomeHandler(req, res) {
    const allData = await blog.find({
        visibility: 'public'
    })
    if (req.user) {
        return res.render('home', {
            role: req.user.role,
            allData: allData,
            name: req.user.FullName,
            title: 'Home Page'
        })
    }
    else {
        return res.render('home', {
            role: 'Guest',
            allData: allData,
            title: 'Home Page'
        });
    }
}

export async function RegisterUserHandler(req, res) {
    return res.render('register', { title: 'Register Page' });
}
export async function LoginUserHandler(req, res) {
    return res.render('login', { title: 'Login Page' });
}
// router for sigh up

export async function RegisterPersonHandler(req, res) {
    try {
        const { FullName, email, password } = req.body;

        // Check for missing fields
        if (!FullName || !email || !password) {
            return res.status(400).send({ error: 'All fields are required' });
        }
        const isAvailable = await person.findOne({ email });

        if (isAvailable) {
            return res.status(400).send({ error: 'Email is already in use' });
        }

        const newUser = await person.create({
            FullName,
            email,
            password,
        })
        return res.redirect('/')
    } catch (error) {
        // const { status, message } = handleError(error);
        // res.send({ status, message });
        res.json({ error: 'something is wrong: ' })
    }
}
// router for login/
export async function LoginPersonHandler(req, res) {
    try {
        const { Gmail, Password } = req.body;
        // Find the user by email
        const user = await person.findOne({ email: Gmail });
        if (!user) {
            return res.render('login', {
                error: 'incorrect email '
            })
        }
        // Check if the password matches
        const isMatch = await bcrypt.compare(Password, user.password);
        if (!isMatch) {
            return res.render('login', {
                error: 'incorrect password'
            })
        }

        const token = setUser(user)
        return res.cookie('token', token).redirect('/');
    } catch (error) {
        console.error('Internal error:', error);
        res.render('login', {
            error: 'incorrect username or password'
        })
    }
}

export async function LogOutHandler(req, res) {
    res.clearCookie('token');
    res.redirect('/');
}
