import User from "../Model/User.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

export const postNewUser = async (req, res) => {
    console.log(req.body)
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    if (password.trim() == 0 || password.length < 8) {
        return res.status(400).json({ message: 'Password must be atleast 6 char long' })
    }

    try {
        const isExistingUser = await User.findOne({ email: email });

        if (isExistingUser) {
            return res.status(400).json({ message: 'User alreday ragistered' })
        }

        const hashedPassword = await bcrypt.hash(password, 12);


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Email structure is not correct" })
        }

        try {
            const newUser = new User({
                name,
                email: email,
                password: hashedPassword
            });

            await newUser.save();
            res.status(201).json({ message: 'user Ragistred Successfukky' })
        } catch (error) {
            console.log('date is not saved')
        }

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error })
    }
};

export const postNewAdmin = async (req, res) => {
    try {
        const { username, email, password, role, orders } = req.body;
        if (!username || !email, !password || !role) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        if (password.trim() == 0 || password.length < 8) {
            return res.status(400).json({ message: 'Password must be atleast 6 char long' })
        }

        const isExistingUser = await User.findOne({ email: email });

        if (isExistingUser) {
            return res.status(400).json({ message: 'User alreday ragistered' })
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const emailRegx = /^[^s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegx.test(email)) {
            return res.status(400).json({ message: "Email structure is not correct" })
        }

        const newUser = new User({
            username: username,
            email: emailRegx,
            password: hashedPassword,
            role: 'admin',
            allProducts: [],        // Start with empty, update as admin adds products
            sales: {
                totalSalesAmount: 0,
                successfulOrders: [],
                pendingOrders: [],
            }
        });

        await newUser.save();
        res.status(201).json({ message: 'user Ragistred Successfukky' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error })
    }
};

export const LoginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    try {
        const isExistingUser = await User.findOne({ email: email });
        if (!isExistingUser) {
            return res.status(400).json({ message: 'User is not ragistered' })
        }
        const verifyPassword = bcrypt.compareSync(password, isExistingUser.password);
        if (!verifyPassword) {
            return res.status(400).json({ message: 'Password is wrong' })
        }
        const payload = {
            id: isExistingUser._id,
            username: isExistingUser.username
        };
        const token = jwt.sign(payload, process.env.JWTSECRET);

        res.cookie('token', token, { maxAge: 24 * 60 * 60 * 1000 }); // 1 day
        res.status(200).json({ message: 'Login successfully', token, content: isExistingUser })

    } catch (error) {
        return res.status(500).json({ message: 'Interal server error' });
    }
};

export const LogoutUser = async (req, res) => {
    try {
        if (req.cookie && req.cookie.length > 2) {
            res.cookie = null
        }
        return res.status(200).json({ message: 'User Logout Successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error })
    }
};

export const profileUser = async (req, res) => {
    const { username, password, profilePic } = req.body;
    const { _id } = req.params;
    if ((!username && !password) || !password.trim() == 0) {
        return res.status(400).json({ message: 'Only one field is required' })
    }

    const isExistingUser = await User.findOne({ _id: _id });
    if (!isExistingUser) {
        return res.status(400).json({ message: "Unouthorized User" })
    }

    const updatedContent = {};

    if (username?.trim()) {
        updatedContent.username = username.trim();
    }

    if (password?.trim) {
        const hashedPassword = await bcrypt.hash(password.trim(), 12);
        updatedContent.password = hashedPassword
    }

    if (profilePic?.trim()) {
        updatedContent.profilePic = profilePic.trim();
    }

    if (Object.entries(updatedContent).length === 0) {
        return res.status(400).json({ message: 'there is not data for updation' })
    }


    try {
        const updateUser = await User.findByIdAndUpdate({ _id: id }, { $set: updatedContent });
        res.status(200).json({ message: "Data has updated" })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error })
    }

}