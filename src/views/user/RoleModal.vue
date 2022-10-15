<template>
  <BasicModal v-bind="$attrs" :title="getTitle" @register="registerModal" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #permissions>
        <Tree
          checkable
          :treeData="menuData"
          :checkStrictly="true"
          :checkedKeys="checkedKeys"
          @check="menuCheck"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, unref, reactive } from 'vue';
  import { Tree } from 'ant-design-vue';
  import type { CheckInfo } from 'ant-design-vue/es/vc-tree/props';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { TreeItem, CheckKeys } from '/@/components/Tree';

  import { formSchema } from './role.data';
  import { roleApi } from '/@/api/sys/role';

  export default defineComponent({
    name: 'RoleModal',
    components: { BasicModal, BasicForm, Tree },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const rowId = ref(0);
      const isUpdate = ref(true);
      const menuData = ref<TreeItem[]>([]);
      const checkedKeys = reactive<{ checked: string[]; halfChecked: string[] }>({
        checked: [],
        halfChecked: [],
      });

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 80,
        schemas: formSchema,
        baseColProps: { span: 24 },
        showActionButtonGroup: false,
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        if (unref(menuData).length === 0) {
          menuData.value = (await roleApi.menu()) as any as TreeItem[];
        }

        if (unref(isUpdate)) {
          const { id, name, permissions } = data.record;
          rowId.value = id;
          checkedKeys.checked = permissions;
          setFieldsValue({ name, permissions });
        } else {
          rowId.value = 0;
          checkedKeys.checked = [];
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '添加角色' : '编辑角色'));

      async function menuCheck(_: CheckKeys, e: CheckInfo) {
        const { checked } = e;
        const { eventKey } = e.node;
        const pos = e.node.pos as string;
        const parentKeys = getParentKeys(pos);
        const keys = [eventKey, ...getChildren(pos)];
        const checkedKeysValue = checkedKeys.checked;

        if (checked) {
          keys.forEach((item: string) => {
            if (checkedKeysValue.findIndex((one: string) => one === item) === -1) {
              checkedKeysValue.push(item);
            }
          });
          parentKeys.forEach((item: string) => {
            if (checkedKeysValue.findIndex((one: string) => one === item) === -1) {
              checkedKeysValue.push(item);
            }
          });
          checkedKeys.checked = [...checkedKeysValue];
        } else {
          checkedKeys.checked = checkedKeysValue.filter((item: string) => {
            return keys.findIndex((one: string) => one === item) === -1;
          });
        }

        setFieldsValue({ permissions: checkedKeys.checked });
      }

      function getParentKeys(pos: string) {
        const path = pos.split('-');
        const item = menuData.value;
        let keys: string[] = [];
        let data = undefined as any as Recordable;

        for (let i = 1; i < path.length - 1; i++) {
          const index = path[i];
          if (!data) data = item[index];
          else data = data.children[index];

          keys.push(data.key);
        }

        return keys;
      }

      function getChildren(pos: string) {
        const path = pos.split('-');
        const item = menuData.value;
        let data = undefined as any as Recordable;

        for (let i = 1; i < path.length; i++) {
          const index = path[i];
          if (!data) data = item[index];
          else data = data.children[index];
        }

        const keys = getChildrenKeys(data);

        return keys;
      }

      function getChildrenKeys(data: Recordable, keys: string[] = []) {
        const children = data.children || [];

        children.forEach((item: Recordable) => {
          keys.push(item.key);

          if (item.children) {
            keys = getChildrenKeys(item, keys);
          }
        });

        return keys;
      }

      async function handleSubmit() {
        try {
          const params = await validate();

          setModalProps({ confirmLoading: true });

          if (unref(isUpdate)) {
            await roleApi.update(rowId.value, params);
          } else {
            await roleApi.create(params);
          }

          setModalProps({ confirmLoading: false });
          closeModal();
          emit('success');
        } catch (err) {
          setModalProps({ confirmLoading: false });
        }
      }

      return {
        menuData,
        getTitle,
        checkedKeys,
        menuCheck,
        handleSubmit,
        registerForm,
        registerModal,
      };
    },
  });
</script>
