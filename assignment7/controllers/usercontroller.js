const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../modals/user');
const Blog = require('../modals/blog');
const HttpError = require('../utils/http-error');




const userSignup = async (req, res, next) => {

    const { firstName, lastName, email, password, dateOfBirth } = req.body;

    let existingUser;
    try {
        // to find existing user
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError("signup failed ,please try again later!", 500);
        return next(error);
    }
    
    if (existingUser) {
        const error = new HttpError("email already in use!", 422);
        return next(error);
    }
    
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError("Password encryption failed", 500);
        return next(error);
    }

    //    user create
    const createdUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        dateOfBirth: dateOfBirth || 0,
        role:'User'
    });

    try {
        await createdUser.save();
    } catch (err) {
        console.log(err);
        const error = new HttpError('signup failed', 500);
        return next(error);
    }
    
    let token;
    try {
        token = jwt.sign(
            {
                userId: createdUser.id,
                firstName: createdUser.firstName,
                email: createdUser.email,
                dateOfBirth: createdUser.dateOfBirth,
            },
            "userSecretKey",
            { expiresIn: "1h" }
        );
    } catch (err) {
        const error = new HttpError("invalid credentials", 500);
        return next(error);
    }
   
    return res.json(
        {
            'user-id':createdUser.id,
            'firstName': createdUser.firstName,
            'email': createdUser.email,
            'dateOfBirth': createdUser.dateOfBirth,
            'token': token
        }
    )
};



const userLogin = async (req, res, next) => {
    
     const { email, password } = req.body;
    let existingUser
    try {
        existingUser = await User.findOne({ email: email },);
    }
    catch (err) {
        const error = new HttpError("login failed", 500)
        return next(error);
    }
   
    if (!existingUser) {
        const error = new HttpError("user doesn't exists , please signup first", 403)
        return next(error);
    }
    
    let isValidPassword = false;
    
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch {
        const error = new HttpError("login failed", 403);
        return next(error);
    }
    
    if (!isValidPassword) {
        const error = new HttpError("invalid credentials", 403);
        return next(error);
    }
   
    let token;
    
    try {
         token = jwt.sign(
            {
                userId: existingUser.id,
                firstName: existingUser.firstName,
                email: existingUser.email,
                dateOfBirth: existingUser.dateOfBirth
            },
            "userSecretKey",
            { expiresIn: "1h" }
        );
    } catch (err) {
        console.log(err);
        const error = new HttpError("invalid credentials", 500);
        return next(error);
    }
    res.json({'user':existingUser.firstName,'message': 'user logged in successfully',
      'token': token
    });
};

const getUser = async (req, res, next) => {
    const { email, password } = req.body;
    let existingUser
    try {
        existingUser = await User.findOne({ email: email },);
    }
    catch (err) {
        const error = new HttpError("login failed", 500)
        return next(error);
    }
    if (!existingUser) {
        const error = new HttpError("User not found", 403)
        return next(error);
    }
    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch {
        const error = new HttpError("login failed", 500);
        return next(error);
    }
    if (!isValidPassword) {
        const error = new HttpError("invalid credentials", 403);
        return next(error);
    }

    let token;
    try {

        token = jwt.sign(
            {
                userId: existingUser.id,
                firstName: existingUser.firstName,
                email: existingUser.email,
                dateOfBirth: existingUser.dateOfBirth
            },
            "userSecretKey",
            { expiresIn: "1h" }
        );


    } catch (err) {
        console.log(err);
        const error = new HttpError("invalid credentials", 500);
        return next(error);
    }
    res.status(200).json({
        'firstName': existingUser.firstName,
        'email': existingUser.email,
        'dateOfBirth': existingUser.dateOfBirth,
        'token': token
    });
};

const postBlog = async (req, res, next) => {
    
    const { email, password,heading,blog } = req.body;
    
    let existingUser
    try {
        existingUser = await User.findOne({ email: email },);
    }
    catch (err) {
        const error = new HttpError("login failed", 500)
        return next(error);
    }
    
    if (!existingUser) {
        const error = new HttpError("User does not exists", 403)
        return next(error);
    }
    
    let isValidPassword = false;
    
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch {
        const error = new HttpError("login failed", 403);
        return next(error);
    }
    if (!isValidPassword) {
        const error = new HttpError("invalid credentials", 403);
        return next(error);
    }

    const createdBlog = new Blog({
       email:email,
       password:password,
       heading : heading,
       blog : blog,
    });

    try {
        await createdBlog.save();
    } catch (err) {
        console.log(err);
        const error = new HttpError('Blog creation failed', 500);
        return next(error);
    }
   
    return res.status(200).json(
        {
            'message' : "Congrats Blog posted!!!!"
        }
    )
};

const getBlog = async (req, res, next) => {
    
    const { email, password,heading} = req.body;
    
    let existingUser
    
    try {
        existingUser = await User.findOne({ email: email },);
    }
    catch (err) {
        const error = new HttpError("login failed", 500)
        return next(error);
    }
    
    if (!existingUser) {
        const error = new HttpError("user doesn't exists ,please signup first", 403)
        return next(error);
    }
    
    let isValidPassword = false;
   
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch {
        const error = new HttpError("login failed", 403);
        return next(error);
    }
    
    if (!isValidPassword) {
        const error = new HttpError("invalid credentials", 403);
        return next(error);
    }
    
    if(!heading){
        const error = new HttpError("heading doesn't exists", 403);
        return next(error);
    }
    try {
        token = jwt.sign(
           {
               userId: existingUser.id,
               firstName: existingUser.firstName,
               email: existingUser.email,
               heading:existingUser.heading
           },
           "userSecretKey",
           { expiresIn: "1h" }
       );
   } catch (err) {
       console.log(err);
       const error = new HttpError("invalid credentials", 500);
       return next(error);
   }
   res.json({
   'first-name':existingUser.firstName,
   'email':existingUser.email,
   'User-id':existingUser.id,
   'heading':existingUser.heading,
   'blog':existingUser.blog
  
   });
};


exports.userSignup = userSignup;
exports.userLogin = userLogin;
exports.getUser = getUser;
exports.postBlog = postBlog;
exports.getBlog = getBlog;