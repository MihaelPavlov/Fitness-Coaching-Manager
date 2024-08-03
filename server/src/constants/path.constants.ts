export const PATH = {
  EXERCISES: {
    CREATE: "/create",
    GET_LIST: "/getList",
    GET_DETAILS: "/getDetail",
    GET_TAG_LIST: "/getTagList",
    GET_EQUIPMENT_LIST: "/getEquipmentList",
    UPDATE: "/update/:exerciseId",
    SEARCH: "/search",
    DELETE:'/delete/:exerciseId'
  },
  USERS: {
    GET_USER_INFO: "/getUserInfo",
    GET_LIST: "/getList",
    GET_DETAILS: "/getDetail",
    REGISTER: "/register",
    LOGIN: "/login",
    UPDATE: "/update",
    SUBSCRIBE: "/subscribe",
    UNSUBSCRIBE: "/unsubscribe",
    HAS_SUBSCRIBED: "/hasSubscribed",
    ADD_TO_COLLECTION: "/addToCollection",
    REMOVE_FROM_COLLECTION: "/removeFromCollection",
    GET_USER_COLLECTION: "/getUserCollection",
    LOGOUT: "/logout"
  },
  CONTRIBUTORS: {
    GET_SUBSCRIBERS: "/getSubscribers",
    GET_LIST: "/getList"
  },
  WORKOUTS: {
    CREATE_WORKOUT: "/add",
    GET_TAG_LIST: "/getTagList",
    SEARCH: "/search"
  },
  SESSIONS: {
    GET_EXERCISES: "/getExercises",
    FINISH_SESSION: "/finish/:workoutId",
  },
  CHAT: {
    CREATE: "/add",
    GET_USER_CHATS: "/getUserChats",
    GET_CHAT: "/getChat",
    CREATE_MESSAGE: "/addMessage",
    GET_MESSAGES: "/getMessages",
  },
};
