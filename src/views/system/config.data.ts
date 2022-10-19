import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    width: 150,
    title: '排序',
    dataIndex: 'sort',
  },
  {
    title: '配置分组',
    dataIndex: 'group',
  },
  {
    title: '配置名称',
    dataIndex: 'name',
  },
  {
    title: '配置别名',
    dataIndex: 'key',
  },
  {
    title: '配置类型',
    dataIndex: 'type',
  },
  {
    title: '配置状态',
    dataIndex: 'status',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'group',
    label: '分组',
    component: 'Select',
    labelWidth: 60,
    colProps: { span: 4 },
    slot: 'group',
  },
  {
    field: 'keyword',
    label: '配置名称/别名',
    component: 'Input',
    labelWidth: 120,
    colProps: { span: 5 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'group',
    label: '配置分组',
    component: 'Select',
    required: true,
    slot: 'group',
  },
  {
    field: 'type',
    label: '配置类型',
    component: 'Select',
    required: true,
    slot: 'type',
  },
  {
    field: 'name',
    label: '配置名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'key',
    label: '配置别名',
    component: 'Input',
    required: true,
  },
  {
    field: 'extra',
    label: '选项',
    component: 'InputTextArea',
    ifShow: ({ values }) => {
      return values.type === 'select' || values.type === 'radio' || values.type === 'checkbox';
    },
    helpMessage: '多个选项之前用英文逗号(,)隔开',
    required: true,
  },
  {
    field: 'sort',
    label: '排序',
    component: 'InputNumber',
    defaultValue: 1,
    componentProps: {
      min: 1,
      max: 100,
      precision: 0,
    },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Switch',
    componentProps: {
      checkedChildren: '启用',
      unCheckedChildren: '停用',
    },
  },
  {
    field: 'remark',
    label: '备注',
    component: 'InputTextArea',
  },
];
