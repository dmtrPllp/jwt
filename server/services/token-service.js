const jwt = require('jsonwebtoken');
const TokenModel = require('../models/token-model');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: '30m'
        });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '30d'
        });
        return {
            accessToken,
            refreshToken
        }
    }

    async validateAccessToken(token) {
        try {
            const UserData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return UserData;
        } catch (e) {
            return null;
        }
    }

    async validateRefreshToken(token) {
        try {
            const UserData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return UserData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await TokenModel.findOne({ user: userId });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await TokenModel.create({ user: userId, refreshToken });
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await TokenModel.deleteOne({ refreshToken });
        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = await TokenModel.fidnOne({ refreshToken });
        return tokenData;
    }
}

module.exports = new TokenService();