import { defHttp } from '/@/utils/http/axios';

enum Api {
  Role = '/role',
  Menu = '/menus',
}

export const roleApi = {
  list: (params: Recordable) => {
    return defHttp.get({
      params,
      url: Api.Role,
    });
  },
  detail: (id: number) => {
    return defHttp.get({
      url: `${Api.Role}/${id}`,
    });
  },
  create: (data: Recordable) => {
    return defHttp.post({
      data,
      url: Api.Role,
    });
  },
  update: (id: number, data: Recordable) => {
    return defHttp.put({
      data,
      url: `${Api.Role}/${id}`,
    });
  },
  del: (id: number) => {
    return defHttp.delete({
      url: Api.Role,
      params: `/${id}`,
    });
  },
  menu: () => {
    return defHttp.get({
      url: Api.Menu,
    });
  },
};
