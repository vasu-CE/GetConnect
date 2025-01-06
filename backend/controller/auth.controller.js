const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const userModel = require('../model/userModel');

dotenv.config();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOTP = async (req , res) => {
    const {email} = req.body;
    let user = await userModel.findOne({email});

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60000);
    if(user){
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        user.isVerified = false;
    }else{
        user = new userModel({
            email,
            otp,
            otpExpiry,
            isVerified: false
        });
    }
    await user.save();

    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth : {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD 
        }
    });

    const mailOptions = {
        from: process.env.EMAIL, 
        to: email,
        subject: 'OTP for Your GetConnect Signup',
        text: `Your OTP code for GetConnect signup is ${otp}. It will expire in 5 minutes.`
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.status(201).json({
            message: 'OTP sent successfully',
            success : true
        })
    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ message: 'Failed to send OTP', success: false });
    }
}

async function verifyOTP(user , otp) {
    // console.log(user.otp);
    
    if (user.otp !== otp) {
        return { success: false, message: "Invalid OTP" };
    }

    if (new Date() > user.otpExpiry) {
        return { success: false, message: "OTP expired" };
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return { success: true, message: 'OTP verified successfully' };
}

const signup = async ( req,res ) => {
    try{
        const {userName , email , password , otp} = req.body;
        if (!userName || !email || !password || !otp) {
            return res.status(400).json({
                message: 'All fields are required',
                success: false
            });
        }

        const user = await userModel.findOne({email});
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false,
            });
        }

        const otpVerification = await verifyOTP(user, otp);
        if (!otpVerification.success) {
            return res.status(401).json({
                message: otpVerification.message,
                success: false,
            });
        }
        
        const hash = await bcrypt.hash(password , 10);
        const updatedUser = await userModel.findOneAndUpdate({ email },
            {
                userName,
                password: hash,
            },
            { new: true } // Return the updated user
        );
        const token = jwt.sign({ userId : user._id }, process.env.JWT_SECRET);
        
        // Set cookie with proper options
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure in production
            sameSite: "lax",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        return res.status(201).json({
            user: updatedUser,
            message: 'Account created successfully',
            success: true
        }) 
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Server error',
            success: false,
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required',
                success: false,
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "User not found",
                success: false
            });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({
                message: 'Invalid credentials',
                success: false,
            });
        }

        const token = jwt.sign({ userId : user._id }, process.env.JWT_SECRET);
        
        // Set cookie with proper options
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure in production
            sameSite: "lax",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        return res.status(200).json({
            user,
            token, // Also send token in response
            message: 'Login successful',
            success: true,
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({
            message: 'Server error',
            success: false,
        });
    }
};

const logout = async (req, res) => {
    try {
        // Clear the token cookie
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0), // Expire immediately
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });

        return res.status(200).json({
            message: 'Logged out successfully',
            success: true
        });
    } catch (err) {
        console.error('Logout error:', err);
        return res.status(500).json({
            message: 'Server error during logout',
            success: false
        });
    }
};

module.exports = {signup , login , sendOTP , logout}