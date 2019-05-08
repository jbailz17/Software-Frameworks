import { UserIDModel } from './user.model';
import { MessageModel } from './message.model';

export class ChannelModel {
    name: string;
    users: UserIDModel[] = [];
    messages: MessageModel[] = [];

    serialize() {
        const json = {
            name: this.name,
            users: this.users,
            messages: this.messages
        }
        return json;
    }
}