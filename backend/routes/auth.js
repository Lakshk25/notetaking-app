const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const fetchuser = require('../middleware/fetchuser')
let jwt = require('jsonwebtoken')
const JWT_SECRET = "simpleSecrettoken"

//ROUTE 1: create a use using : POST "/api/auth/". Doesn't require Auth
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    let success = false;
    // if there are errors , return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }

    // check wheather the user with this email exists already
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({success, error: "Sorry a user with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        secPass = await bcrypt.hash(req.body.password, salt);

        // Create a new User
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true
        res.json({success, authToken })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occureed")
    }
})

//  ROUTE 2: Authenticate a User using: POST "/api/auth/login", No Login Required

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'password cannot be blank').exists()
], async (req, res) => {
    let success = false;
    // if there are errors , return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email , password} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error: "Please try to login with correct credentials"});
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(400).json({success ,error: "Please try to login with correct credentials"})
        }
        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authToken})
    }catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occureed")
    }
})

//  ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". login required

router.post('/getuser', fetchuser , async (req, res) => {
try{
    const userId = req.user.id;
    const user = await User.findById(userId).select("*password");
    res.send(user)

}catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occureed")
}
})


module.exports = router