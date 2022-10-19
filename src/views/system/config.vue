<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button v-auth="'system.config.create'" color="success" @click="handleCreate">
          添加
        </a-button>

        <a-button v-auth="'system.config.sort'" color="warning" @click="handleSort">
          更新排序
        </a-button>
      </template>

      <template #form-group="{ model, field }">
        <a-select v-model:value="model[field]" :options="groups" allowClear placeholder="请选择" />
      </template>

      <template #expandedRowRender="{ record }">
        <Description
          :column="2"
          :contentStyle="{ width: '35%' }"
          :labelStyle="{ width: '15%', textAlign: 'right' }"
          :data="record"
          :schema="schema"
        />
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'sort'">
          <InputNumber v-model:value="record.sort" :min="1" :max="100" :precision="0" />
        </template>
        <template v-else-if="column.key === 'group'">
          {{ getMapName(record.group, 'group') }}
        </template>
        <template v-else-if="column.key === 'type'">
          {{ getMapName(record.type, 'type') }}
        </template>
        <template v-else-if="column.key === 'status'">
          <Tag v-if="record.status" color="#2db7f5">启用</Tag>
          <Tag v-else color="#f50">停用</Tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                auth: 'system.config.update',
                onClick: handleUpdate.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                auth: 'system.config.delete',
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record.id),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>

    <ConfigModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { Select, InputNumber, Tag } from 'ant-design-vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { Description, DescItem } from '/@/components/Description/index';

  import ConfigModal from './ConfigModal.vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { columns, searchFormSchema } from './config.data';
  import { configMap, configApi } from '/@/api/sys/config';

  export default defineComponent({
    name: 'ConfigTable',
    components: {
      BasicTable,
      ASelect: Select,
      InputNumber,
      Tag,
      TableAction,
      Description,
      ConfigModal,
    },
    setup() {
      const types = ref<Recordable[]>([]);
      const groups = ref<Recordable[]>([]);

      const [registerModal, { openModal }] = useModal();
      const { createMessage } = useMessage();

      const schema: DescItem[] = [
        {
          label: '配置项值',
          field: 'value',
        },
        {
          label: '选项',
          field: 'extra',
        },
      ];

      const [registerTable, { reload, getDataSource }] = useTable({
        title: '配置列表',
        api: configApi.list,
        columns,
        formConfig: {
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 200,
          title: '操作',
          dataIndex: 'action',
        },
      });

      function handleSort() {
        const list = getDataSource();
        const data = list.map((item) => ({ id: item.id, sort: item.sort }));
        configApi.sort({ data }).then(() => {
          createMessage.success('操作成功');
          handleSuccess();
        });
      }

      function handleCreate() {
        openModal(true, {
          isUpdate: false,
          types: types.value,
          groups: groups.value,
        });
      }

      function handleUpdate(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
          types: types.value,
          groups: groups.value,
        });
      }

      function handleDelete(id: number) {
        configApi.del(id).then(() => {
          createMessage.success('删除成功');
          handleSuccess();
        });
      }

      function handleSuccess() {
        reload();
      }

      function getMapName(key: string, type: string) {
        const map = type === 'type' ? types.value : groups.value;

        const one = map.find((item) => item.value === key);

        return one ? one.label : key;
      }

      onMounted(() => {
        getMap();
      });

      async function getMap() {
        const { type, group } = await configMap();

        types.value = type;
        groups.value = group;
      }

      return {
        groups,
        schema,
        getMapName,
        registerTable,
        registerModal,
        handleSort,
        handleCreate,
        handleUpdate,
        handleDelete,
        handleSuccess,
      };
    },
  });
</script>
