import jwt from "jsonwebtoken";

export const sign = (payload: string | object | Buffer, secret: jwt.Secret, options: jwt.SignOptions | undefined) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, options, (err: any, payload) => {
            if (err) {
                reject (err);
            } else {
                resolve(payload);
            }
        })
    })
};

export const verify = (token: string, secret: jwt.Secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, {}, (err: any, payload: any) => {
            if (err) {
                reject (err);
            } else {
                resolve(payload);
            }
        })
    })
}