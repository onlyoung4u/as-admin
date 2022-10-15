import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    width: 200,
    title: '操作人/用户ID',
    dataIndex: 'operator',
  },
  {
    title: '操作',
    dataIndex: 'full_path',
  },
  {
    title: '请求类型',
    dataIndex: 'method',
  },
  {
    title: 'IP',
    dataIndex: 'ip',
  },
  {
    title: '操作时间',
    dataIndex: 'created_at',
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'uid',
    label: '用户ID',
    component: 'Input',
    colProps: { span: 4 },
  },
];
