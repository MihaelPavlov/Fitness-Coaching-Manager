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

export const mapContributors = async (contributors: Array<any>) => {
    return Promise.all(
        contributors.map(async (contributor) => {
            contributor = await mapContributor(contributor);
            return contributor;
        })
    )
}

const mapContributor = async (contributor: Record<string, any>) => {
    const builder = new UserBuilder({
        what: {
            firstName: 1,
            lastName: 1,
            profilePicture: 1,
            dateCreated: 1
        }
    });
    builder.entityById = contributor.userId;

    const result = (await builder.buildQuery()).at(0);
    for (let [key, value] of Object.entries(result)) {
        contributor[key] = value;
    }

    return contributor;
}