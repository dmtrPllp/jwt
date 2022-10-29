const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const tokenService = require('../services/token-service');
const mailService = require('../services/mail-service');


class UserService {
    async registration(email, password) {
        const candidate = await UserModel.findOne({ email });
        if (candidate) {
            throw new Error(`Пользователь с почтовым адресом ${email} уже существуе!`);
        }
        const hashpassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const user = await UserModel.create({ email, password: hashpassword })
        await mailService.sendActivationMail(email, activationLink);
        const token = tokenService.generateTokens()

    }
}

module.exports = new UserService();