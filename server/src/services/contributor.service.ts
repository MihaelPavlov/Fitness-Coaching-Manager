import { UserBuilder } from "./../query-builders/user.builder";
import { QueryParams } from "./../query-builders/models/builder.models";

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

export const getContributorSubscribers = async (contributorId: number) => {
  const queryParams: QueryParams = {
    what: {
      
    }
  }
}