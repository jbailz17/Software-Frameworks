import { UserIDModel } from './user.model';

export class MessageModel {
    user: string;
    content: string;

    serialize() {
        const json = {
            user: this.user,
            content: this.content
        }
        return json;
    }
}