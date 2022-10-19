<template>
  <BasicModal v-bind="$attrs" :title="getTitle" @register="registerModal" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #group="{ model, field }">
        <ASelect v-model:value="model[field]" :options="groupData" />
      </template>

      <template #type="{ model, field }">
        <ASelect v-model:value="model[field]" :options="typeData" />
      </template>
    </BasicForm>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, ref, unref, computed } from 'vue';
  import { Select } from 'ant-design-vue';
  import type { SelectProps } from 'ant-design-vue';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';

  import { formSchema } from './config.data';
  import { configApi } from '/@/api/sys/config';

  export default defineComponent({
    name: 'ConfigModal',
    components: { BasicModal, BasicForm, ASelect: Select },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const rowId = ref(0);
      const isUpdate = ref(true);
      const typeData = ref<SelectProps['options']>([]);
      const groupData = ref<SelectProps['options']>([]);

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 80,
        schemas: formSchema,
        baseColProps: { span: 24 },
        showActionButtonGroup: false,
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        typeData.value = data.types;
        groupData.value = data.groups;

        if (unref(isUpdate)) {
          const { id } = data.record;
          rowId.value = id;
          setFieldsValue({ ...data.record });
        } else {
          rowId.value = 0;
          setFieldsValue({ status: true });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '添加配置' : '修改配置'));

      async function handleSubmit() {
        try {
          const params = await validate();

          setModalProps({ confirmLoading: true });

          if (unref(isUpdate)) {
            await configApi.update(rowId.value, params);
          } else {
            await configApi.create(params);
          }

          setModalProps({ confirmLoading: false });
          closeModal();
          emit('success');
        } catch (err) {
          setModalProps({ confirmLoading: false });
        }
      }

      return {
        typeData,
        groupData,
        getTitle,
        handleSubmit,
        registerForm,
        registerModal,
      };
    },
  });
</script>
