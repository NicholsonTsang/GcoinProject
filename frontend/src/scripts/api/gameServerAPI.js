import {reqRealEndAsync} from "./axiosUtil";
import {config} from "./config";

export const createOrder = (params, callback) => {
    return reqRealEndAsync("post", config.gameServerDomain,
        "/createOrder", params, callback);
};

export const submitReceipt = (params, callback) => {
    return reqRealEndAsync("post", config.gameServerDomain,
        "/verifyTransaction", params, callback);
};