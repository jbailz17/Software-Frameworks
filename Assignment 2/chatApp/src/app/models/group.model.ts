import { UserIDModel } from './user.model';
import { ChannelModel } from './channel.model';

export class GroupModel {
    _id: string;
    name: string;
    users: UserIDModel[] = [];
    channels: ChannelModel[] = [];

    serialize() {
        const json = {
            _id: this._id,
            name: this.name,
            users: this.users,
            channels: this.channels
        }
        return json;
    }
}