<template>
  <BasicTable @register="registerTable">
    <template #toolbar>
      <a-popconfirm
        title="确认清空日志吗？"
        ok-text="确认"
        cancel-text="取消"
        @confirm="handleClear"
      >
        <a-button v-auth="'actionLogs.clear'" color="error">清空日志</a-button>
      </a-popconfirm>
    </template>

    <template #expandedRowRender="{ record }">
      {{ record.content }}
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key == 'operator'">
        {{ record.action_uid === 0 ? '未登录' : record.operator.nickname }} /
        {{ record.action_uid }}
      </template>

      <template v-else-if="column.key == 'method'">
        <a-tag v-if="record.method == 'DELETE'" color="#f50">{{ record.method }}</a-tag>
        <a-tag v-else-if="record.method == 'PUT'" color="#87d068">{{ record.method }}</a-tag>
        <a-tag v-else color="#2db7f5">{{ record.method }}</a-tag>
      </template>

      <template v-else-if="column.key == 'status'">
        <a-tag v-if="record.status == 1" color="#87d068">成功</a-tag>
        <a-tag v-else color="#f50">失败</a-tag>
      </template>
    </template>
  </BasicTable>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Tag, Popconfirm } from 'ant-design-vue';

  import { BasicTable, useTable } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { logsApi } from '/@/api/sys/user';
  import { columns, searchFormSchema } from './logs.data';

  export default defineComponent({
    name: 'LogsManagement',
    components: { BasicTable, ATag: Tag, APopconfirm: Popconfirm },
    setup() {
      const { createMessage } = useMessage();

      const [registerTable, { reload }] = useTable({
        title: '日志列表',
        api: logsApi.list,
        columns,
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        pagination: { pageSize: 15 },
      });

      function handleClear() {
        logsApi.clear().then(() => {
          createMessage.success('清除成功');
          reload();
        });
      }

      return {
        registerTable,
        handleClear,
      };
    },
  });
</script>
