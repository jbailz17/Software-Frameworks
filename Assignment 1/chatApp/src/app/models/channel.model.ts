import { UserModel } from './user.model';

export class ChannelModel {
    name: string;
    users: UserModel[] = [];

    serialize() {
        const json = {
            name: this.name,
            users: this.users
        }
        return json;
    }
}