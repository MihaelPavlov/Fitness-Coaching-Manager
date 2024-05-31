export const fieldsMap: any = {
  users: {
    uid: "id",
    firstName: "first_name",
    lastName: "last_name",
    userName: "username",
    email: "email",
    password: "password",
    profilePicture: "profile_picture_url",
    country: "country",
    userLanguages: "languages",
    phoneNumber: "phone_number",
    userRole: "user_role",
    visible: "visible",
    dateCreated: "date_created",
  },
  user_specs: {
    userId: "user_id",
    sex: "sex",
  },
};

export const associationsObj: any = {
  users: ["user_specs"], // fieldsMap names only
};
