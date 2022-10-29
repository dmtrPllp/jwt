module.exports = class UserDto {
    email;
    is;
    isActivated;

    constructor(model){
        this.email = model.email;
        this.id = model._id;
        this.isActivated= model.isActivated;
    }
}