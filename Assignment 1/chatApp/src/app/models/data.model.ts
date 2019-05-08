import { UserModel } from './user.model';
import { GroupModel } from './group.model';

export class DataModel {
    users: UserModel[];
    groups: GroupModel[];

    serialize() {
        const json = {
            users: this.users,
            groups: this.groups
        }
        return json;
    }
}