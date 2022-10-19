import { defHttp } from '/@/utils/http/axios';

enum Api {
  Config = '/config',
  Configs = '/configs',
}

export function configMap() {
  return defHttp.get({ url: `${Api.Config}/dict` });
}

export const configApi = {
  list: (params: Recordable) => {
    return defHttp.get({
      params,
      url: Api.Config,
    });
  },
  sort: (data: Recordable) => {
    return defHttp.post({
      data,
      url: `${Api.Config}/sort`,
    });
  },
  create: (data: Recordable) => {
    return defHttp.post({
      data,
      url: Api.Config,
    });
  },
  update: (id: number, data: Recordable) => {
    return defHttp.put({
      data,
      url: `${Api.Config}/${id}`,
    });
  },
  del: (id: number) => {
    return defHttp.delete({
      params: `/${id}`,
      url: Api.Config,
    });
  },
};

export const configsApi = {
  group: () => {
    return defHttp.get({
      url: `${Api.Configs}/group`,
    });
  },
  list: (params: Recordable) => {
    return defHttp.get({
      params,
      url: Api.Configs,
    });
  },
  update: (data: Recordable) => {
    return defHttp.post({
      data,
      url: Api.Configs,
    });
  },
};
