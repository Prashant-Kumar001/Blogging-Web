import person from '../model/user.model.js';
import blog from '../model/blog.model.js';
export async function AdminHandler(req, res) {
    try {
        const user = await person.find({})
        res.render('admin', {
            users: user,
            name: req.user.FullName
        })
    } catch (error) {
        res.render('home')
    }
}
export async function UserEditHandler(req, res) {
    const id = req.params.id
    const user = await person.findById(id)
    res.render('edit-user', {
        user: user
    })
}
export async function UserDeleteHandler(req, res) {
    const id = req.params.id
    const user = await person.findByIdAndDelete(id)
    res.render('deleteUser', {
        user: user
    })
}
export async function UserUpdateHandler(req, res) {
    try {
        const oldId = req?.user?.email
        const id = req.params.id;
        // Prepare update object
        const updateData = {
            FullName: req.body.name,
            email: req.body.email
        };
        // Hash the password if it's provided
        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            updateData.password = hashedPassword;
        }

        // Find the user by ID and update
        const updatedUser = await person.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedUser) {
            // Handle user not found case
            return res.status(404).render('error', { message: 'User not found' });
        }

        await blog.updateMany(
            { email: oldId }, // Filter: find documents by current email
            { $set: { email: req.body.email } } // Update: set new email
        );
        res.clearCookie('token');
        res.redirect('/login');
    } catch (error) {
        return res.status(500).render('error', {
            errorCode: 500,
            errorTitle: 'Internal Server Error',
            errorMessage: 'An error occurred while updating the user!',
        });
    }
}
export async function settingsHandler(req, res) {
    res.render('settings', {
        user: req.user
    })
}