import { UserBuilder } from "./../query-builders/user.builder";
import { QueryParams } from "./../query-builders/models/builder.models";
import { ContributorSubscribersBuilder } from "./../query-builders/contributor-subscribers.builder";
import { mapSubscribers } from "./../helpers/contributor.helper";

export const getContributors = async (payload: QueryParams) => {
  const builder = new UserBuilder(payload);
  return await builder.buildQuery();
}

export const getContributorId = async (id: number) => {
  const queryParams: QueryParams = {
    what: {
      contributorId: 1,
    }
  }
  const builder = new UserBuilder(queryParams);
  builder.entityById = id;
  const contributorId = (await builder.buildQuery()).at(0).contributorId;
  return contributorId;
};

export const getContributorSubscribers = async (contributorId: number, queryParams: any) => {
  const builder = new ContributorSubscribersBuilder(queryParams);
  builder.defaultCondition = {
    type: "AND",
    items: [
      {
        field: "contributor",
        operation: "EQ",
        value: contributorId
      }
    ]
  };

  return await mapSubscribers(await builder.buildQuery());
}