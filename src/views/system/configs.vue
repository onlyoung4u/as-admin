<template>
  <PageWrapper content-full-height class="bg-white">
    <a-tabs type="card" v-model:activeKey="activeKey">
      <a-tab-pane v-for="item in groupList" :key="item.value" :tab="item.label">
        <ConfigsForm :group="item.value" :types="types" :groups="groups" />
      </a-tab-pane>
    </a-tabs>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { Tabs, TabPane } from 'ant-design-vue';

  import { PageWrapper } from '/@/components/Page';
  import ConfigsForm from './ConfigsForm.vue';

  import { configMap, configApi } from '/@/api/sys/config';

  export default defineComponent({
    components: {
      PageWrapper,
      ATabs: Tabs,
      ATabPane: TabPane,
      ConfigsForm,
    },
    setup() {
      const activeKey = ref('');
      const types = ref<Recordable[]>([]);
      const groups = ref<Recordable[]>([]);
      const groupList = ref<Recordable[]>([]);

      async function getMap() {
        const data = await configMap();
        const { type, group } = data;

        types.value = type;
        groups.value = group;

        const list = await configApi.group();

        groupList.value = list.map((item: string) => {
          return group.find((one: Recordable) => one.value === item);
        });

        if (list.length > 0) activeKey.value = list[0].group;
      }

      onMounted(() => {
        getMap();
      });

      return {
        types,
        groups,
        groupList,
        activeKey,
      };
    },
  });
</script>
