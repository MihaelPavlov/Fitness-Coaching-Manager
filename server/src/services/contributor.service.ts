import { UserBuilder } from "./../query-builders/user.builder";
import { QueryParams } from "./../query-builders/models/builder.models";
import { ContributorSubscribersBuilder } from "./../query-builders/contributor-subscribers.builder";
import { mapContributors, mapSubscribers } from "./../helpers/contributor.helper";
import { ContributorBuilder } from "./../query-builders/contributor.builder";

export const getContributors = async (payload: QueryParams) => {
  const builder = new ContributorBuilder(payload);
  let contributors = await builder.buildQuery();

  contributors = await Promise.all(
    contributors.map(async (contributor) => {
      contributor["subscribersCount"] = await getContributorSubscribersCount(contributor.contributorId);
      return contributor;
    })
  );

  contributors = await mapContributors(contributors);

  if (payload.order) {
    contributors = contributors.sort((a: any, b: any) => {
      return b.dateCreated-a.dateCreated
    })
  } else {
    contributors = contributors.sort((a: any, b: any) => {
      return b.subscribersCount-a.subscribersCount
    })
  }

  return contributors;
};

export const getContributorId = async (id: number) => {
  const queryParams: QueryParams = {
    what: {
      contributorId: 1,
    },
  };
  const builder = new UserBuilder(queryParams);
  builder.entityById = id;
  const contributorId = (await builder.buildQuery()).at(0).contributorId;
  return contributorId;
};

export const getContributorSubscribers = async (
  contributorId: number,
  queryParams: any
) => {
  const builder = new ContributorSubscribersBuilder(queryParams);
  builder.defaultCondition = {
    type: "AND",
    items: [
      {
        field: "contributor",
        operation: "EQ",
        value: contributorId,
      },
    ],
  };

  return await mapSubscribers(await builder.buildQuery());
};

const getContributorSubscribersCount = async (contributorId: number) => {
  const queryParams: QueryParams = {
    condition: {
      type: "AND",
      items: [
        {
          field: "contributor",
          operation: "EQ",
          value: contributorId,
        },
      ],
    },
  };

  const builder = new ContributorSubscribersBuilder(queryParams);
  return (await builder.buildQuery()).length;
};
