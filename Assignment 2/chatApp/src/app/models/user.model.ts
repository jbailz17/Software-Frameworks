export class UserModel {
    _id: string;
    username: string;
    email: string;
    access: string;
    password: string;
    imagePath: string;

    serialize() {
        const json = {
            _id: this._id,
            username: this.username,
            email: this.email,
            access: this.access,
            password: this.password,
            imagePath: this.imagePath
        }
        return json;
    }
}

export class UserIDModel {
    _id: string;

    serialize() {
        const json = {
            _id: this._id
        }
        return json;
    }
}