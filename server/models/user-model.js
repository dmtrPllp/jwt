const {Schemam ,model} = require('mongoose');


const userSchema = new Schemam({
    email: { type: String, unique: true, required: true},
    password: { type: String, required: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String}
});

modeule.exports = model('User',userSchema);