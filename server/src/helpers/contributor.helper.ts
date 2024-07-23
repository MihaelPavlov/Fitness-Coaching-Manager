import { UserBuilder } from "./../query-builders/user.builder"

export const mapSubscribers = async (subscibers: Array<any>) => {
    return Promise.all(
        subscibers.map(async (sub) => {
            sub = await mapSubscriberId(sub.subscriber)
            return sub;
        })
    )
}

const mapSubscriberId = async (subscriberId: number) => {
    const builder = new UserBuilder({
        what: {
            uid: 1,
            userName: 1,
            profilePicture: 1
        }
    });
    builder.entityById = subscriberId;

    return (await builder.buildQuery()).at(0)
}