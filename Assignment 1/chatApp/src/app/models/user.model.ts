export class UserModel {
    username: string;
    email: string;
    access: string;

    serialize() {
        const json = {
            username: this.username,
            email: this.email,
            access: this.access
        }
        return json;
    }
}