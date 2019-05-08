import { UserModel } from './user.model';
import { ChannelModel } from './channel.model';

export class GroupModel {
    name: string;
    users: UserModel[] = [];
    channels: ChannelModel[] = [];

    serialize() {
        const json = {
            name: this.name,
            users: this.users,
            channels: this.channels
        }
        return json;
    }
}