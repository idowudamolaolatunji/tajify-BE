const crypto = require('crypto');

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const slugify = require('slugify');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'A user must provide their fullname'],
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: [true, 'A user must have an email'],
        validate: [validator.isEmail, 'Enter a valid email'],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'A user must provide a password'],
        trim: true,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'A user must confirm their password'],
        validate: {
            // validator only works on create or on save
            validator: function(el) {
                return el === this.password;
            },
            message: 'Password are not the same'
        }
    },
    otp: {
        type: Number,
        select: false
    },
    isOTPVerified: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    slug: String,
    referralUrl: String,
    profileUrl: String,
    signedUpAt: {
        type: Date,
        default: Date.now
    }
});

// onSave pre hook
const saltRounds = 12;
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPassword;
    this.passwordConfirm = undefined;
    next();
});
userSchema.pre('save', function(next) {
    const slug = slugify(this.username, { lower: true });
    this.slug = `${slug}-${this._id}`;
    next();
});
userSchema.pre('save', async function(next) {
    if(this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 100;
    next();
});
userSchema.pre('save', function(next) {
    this.referalUrl = `refer/${this.username}-${crypto.randomUUID()}`
    this.profileUrl = `profile/${this.slug}`
    next();
})
userSchema.pre('save', function(next) {
    this.otpExpires = Date.now() + 5 * 60 * 1000;
    next();
})


// Instance methods
userSchema.methods.changedPasswordAfter = async function(jtwTimeStamp) {
    if(this.passwordChangedAt) {
        const changePasswordTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return jtwTimeStamp > changePasswordTimeStamp;
    }
    return false;
}
userSchema.methods.comparePassword = async function(candidatePassword, hashedPassword) {
    const encrypted = await bcrypt.compare(candidatePassword, hashedPassword);
    return encrypted;
}
userSchema.methods.createPasswordResetToken = function() {
    // create random bytes token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // simple hash random bytes token
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetToken = hashedToken;

    // create time limit for token to expire (10 mins)
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
    // send the unencrypted version
}

userSchema.methods.isOTPExpired = function() {
    if(this.otp && this.otpExpires) {
        return Date.now() > this.otpExpires;
    }
    return false;
}

const User = mongoose.model('User', userSchema);
module.exports = User;