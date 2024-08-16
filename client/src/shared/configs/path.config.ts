export const PATH = {
  USERS: {
    GET_LIST: 'users/getList',
    LOGIN: 'users/login',
    REGISTER: 'users/register',
    UPDATE: 'users/update',
    CURRENT_USER: 'users/getUserInfo',
    GET_DETAIL: 'users/getDetail',
    SUBSCRIBE: 'users/subscribe',
    UNSUBSCRIBE: 'users/unsubscribe',
    HAS_SUBSCRIBED: 'users/hasSubscribed',
    ADD_TO_COLLECTION: 'users/addToCollection',
    REMOVE_FROM_COLLECTION: 'users/removeFromCollection',
    GET_USER_COLLECTION: 'users/getUserCollection',
    LOGOUT: "users/logout"
  },
  CONTRIBUTORS: {
    GET_SUBSCRIBERS: 'contributors/getSubscribers',
    GET_LIST: 'contributors/getList'
  },
  EXERCISES: {
    GET_LIST: 'exercises/getList',
    GET_DETAILS: 'exercises/getDetail',
    CREATE: 'exercises/create',
    GET_TAG_LIST: 'exercises/getTagList',
    GET_EQUIPMENT_LIST: 'exercises/getEquipmentList',
    UPDATE:'exercises/update/',
    DELETE:'exercises/delete/'
  },
  WORKOUTS: {
    GET_WORKOUTS: 'workouts/getList',
    GET_TAG_LIST: 'workouts/getTagList',
    CREATE_WORKOUT: 'workouts/add',
    SEARCH: "workouts/search?title="
  },
  SESSIONS: {
    GET_EXERCISES: 'sessions/getExercises',
    GET_EXERCISE: 'sessions/getExercise',
    FINISH_WORKOUT: 'sessions/finish/',
  },
  LANGUAGES: {
    GET_LANGUAGES: "languages/getList"
  }
};
