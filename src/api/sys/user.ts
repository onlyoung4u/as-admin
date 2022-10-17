import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  Login = '/login',
  Logout = '/logout',
  GetUserInfo = '/me',
  GetPermCode = '/permissions',
  User = '/user',
  Logs = '/action_logs',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.post({ url: Api.Logout });
}

export const userApi = {
  list: (params: Recordable) => {
    return defHttp.get({
      params,
      url: Api.User,
    });
  },
  roles: () => {
    return defHttp.get({
      url: `${Api.User}/roles`,
    });
  },
  create: (data: Recordable) => {
    return defHttp.post({
      data,
      url: Api.User,
    });
  },
  edit: (id: number, data: Recordable) => {
    return defHttp.put({
      data,
      url: `${Api.User}/${id}`,
    });
  },
  del: (id: number) => {
    return defHttp.delete({
      params: `/${id}`,
      url: Api.User,
    });
  },
};

export const logsApi = {
  list: (params: Recordable) => {
    return defHttp.get({
      params,
      url: Api.Logs,
    });
  },
  clear: () => {
    return defHttp.post({
      url: `${Api.Logs}/clear`,
    });
  },
};
