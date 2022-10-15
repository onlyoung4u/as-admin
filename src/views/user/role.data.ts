import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    width: 100,
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '创建人',
    dataIndex: ['owner', 'nickname'],
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '角色名称',
    component: 'Input',
    colProps: { span: 4 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'name',
    label: '角色名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'permissions',
    label: '权限',
    component: 'Input',
    slot: 'permissions',
    rules: [{ required: true, type: 'array', message: '请选择权限' }],
  },
];
