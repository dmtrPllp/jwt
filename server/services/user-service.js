const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const tokenService = require('../services/token-service');
const mailService = require('../services/mail-service');
const UserDto = require('../dto/user-dto');
const uuid = require('uuid');
const ApiError = require('../exceptions/api-error');

class UserService {
    async registration(email, password) {
        const candidate = await UserModel.findOne({ email });
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существуе!`);
        }
        const hashpassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const user = await UserModel.create({ email, password: hashpassword, activationLink })
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
        return await this.generateTokensForUserDto(user);
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({ activationLink });
        if (!user) {
            throw ApiError.BadRequest('Некорректная ссылка активации');
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} не существует!`);
        }
        if (!(await bcrypt.compare(password, user.password))) {
            throw ApiError.BadRequest(`Неверный пароль`);
        }
        return await this.generateTokensForUserDto(user);
    }

    async generateTokensForUserDto(user) {
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto
        }
    }
}



module.exports = new UserService();