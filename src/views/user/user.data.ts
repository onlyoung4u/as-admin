import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    width: 100,
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '账号',
    dataIndex: 'username',
  },
  {
    title: '名称',
    dataIndex: 'nickname',
  },
  {
    title: '角色',
    dataIndex: 'roles',
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    colProps: { span: 4 },
  },
  {
    field: 'username',
    label: '账号',
    component: 'Input',
    colProps: { span: 4 },
  },
  {
    field: 'nickname',
    label: '名称',
    component: 'Input',
    colProps: { span: 4 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'username',
    label: '账号',
    component: 'Input',
    required: true,
  },
  {
    field: 'nickname',
    label: '名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'password',
    label: '密码',
    component: 'InputPassword',
    rules: [{ required: true }, { min: 8, max: 20, message: '密码长度8-20位' }],
  },
  {
    field: 'status',
    label: '状态',
    component: 'Switch',
    componentProps: {
      checkedChildren: '启用',
      unCheckedChildren: '禁用',
    },
    required: true,
  },
  {
    field: 'roles',
    label: '角色',
    component: 'Select',
    slot: 'selectRole',
    required: true,
  },
];
