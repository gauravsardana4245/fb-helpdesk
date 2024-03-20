const User = require('../models/User');
var jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs")

const JWT_SECRET = "gaurav$ardana"

const register = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({status: false, error: "Sorry a user with this email already exists!" });
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email
    })

    const data = {
        user: {
            id: user.id,
            name: user.name
        }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json({ authtoken, name: user.name });
    // console.log(authtoken);
}
catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
}
};

const login = async (req, res) => {
  const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({success: false, error: "Entered email does not exists!" });
            }
            const comparePassword = await bcrypt.compare(password, user.password);
            if (!comparePassword) {

                return res.status(400).json({success: false, error: "Please try to login with correct credentials!" });
            }
            const data = {
                user: {
                    id: user.id,
                    name: user.name
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET);

            res.status(200).json({success: true, authtoken, name: user.name });
            // console.log(authtoken);
        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error occured");
        }
};

module.exports = {
  register,
  login
}
