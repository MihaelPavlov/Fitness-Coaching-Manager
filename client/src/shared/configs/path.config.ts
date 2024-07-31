export const PATH = {
  USERS: {
    LOGIN: "users/login",
    REGISTER: "users/register",
    UPDATE: "users/update",
    CURRENT_USER: "users/getUserInfo",
    GET_DETAIL: "users/getDetail",
    SUBSCRIBE: "users/subscribe",
    UNSUBSCRIBE: "users/unsubscribe",
    HAS_SUBSCRIBED: "users/hasSubscribed"
  },
  CONTRIBUTORS: {
    GET_SUBSCRIBERS: "contributors/getSubscribers"
  },
  EXERCISES: {
    GET_LIST: 'exercises/getList',
    GET_DETAILS: 'exercises/getDetail',
    CREATE: 'exercises/create',
    GET_TAG_LIST: 'exercises/getTagList',
    GET_EQUIPMENT_LIST: 'exercises/getEquipmentList',
  },
  WORKOUTS: {
    GET_WORKOUTS: "workouts/getWorkouts",
    GET_TAG_LIST: "workouts/getTagList",
    CREATE_WORKOUT: "workouts/add"
  },
  SESSIONS: {
    GET_EXERCISES: "sessions/getExercises",
    FINISH_WORKOUT: "sessions/finish/"
  }
}
