const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'A user must provide their fullname'],
        lowercase: true,
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
        select: false
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
    active: {
        type: Boolean,
        default: true,
    },
    slug: String,
    signedUpAt: {
        type: Date,
        default: Date.now
    }
});

// onSave pre hook
const saltRounds = 12;
userSchema.pre('save', async function(next) {
    if(this.isModified('password')) return next();

    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPassword;

    // delete the confirmpassword field (undefined is best in objects)
    this.passwordConfirm = undefined;

    next();
});
userSchema.pre('save', async function(next) {
    if(this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 100;
    next();
});
userSchema.methods.comparePassword = async function(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
}
userSchema.pre('save', function(next) {
    const slug = slugify(this.fullname, { lower: true, replacement: '-' });
    this.slug = `${slug}-${this._id}`;
    next();
});


// Instance methods
userSchema.methods.changedPasswordAfter = async function(jtwTimeStamp) {
    if(this.passwordChangedAt) {
        const changePasswordTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return jtwTimeStamp > changePasswordTimeStamp;
    }

    return false;
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

const User = mongoose.model('User', userSchema);
module.exports = User;