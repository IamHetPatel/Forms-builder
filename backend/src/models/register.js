const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const registrationSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    tokens:[{
        token:{
            type: String,
            required:true
        }
    }]
})
//generating tokens

// Generate JWT token
registrationSchema.methods.generateAuthToken = async function() {
    try {
        const token = jwt.sign({ _id: this._id.toString() , username: this.username.toString(), email: this.email.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token });
        await this.save();
        return token;
    } catch (e) {
        console.log(`The error is ${e}`);
        throw e;
    }
}

// Hash password before saving
registrationSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const Register = mongoose.model('Register', registrationSchema);

module.exports = Register;
