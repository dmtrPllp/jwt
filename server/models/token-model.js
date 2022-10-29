const {Schemam ,model, Schema} = require('mongoose');


const TokenSchema = new Schemam({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    refreshToken: {type: String, required: true}
});

modeule.exports = model('Token',TokenSchema);