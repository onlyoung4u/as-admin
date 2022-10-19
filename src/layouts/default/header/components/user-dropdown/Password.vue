<template>
  <BasicModal v-bind="$attrs" title="修改密码" @register="registerModal" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { FormSchema } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { resetPwd } from '/@/api/sys/user';

  export default defineComponent({
    name: 'ResetPassword',
    components: { BasicModal, BasicForm },
    setup() {
      const { createMessage } = useMessage();

      const schemas: FormSchema[] = [
        {
          field: 'pwd',
          label: '原密码',
          component: 'InputPassword',
          rules: [{ required: true }, { min: 8, max: 20, message: '密码长度8-20位' }],
        },
        {
          field: 'password',
          label: '新密码',
          component: 'InputPassword',
          rules: [{ required: true }, { min: 8, max: 20, message: '密码长度8-20位' }],
        },
        {
          field: 'passwordRepeat',
          label: '重复新密码',
          component: 'InputPassword',
          rules: [
            { required: true, message: '请重复输入新密码' },
            { min: 8, max: 20, message: '密码长度8-20位' },
          ],
        },
      ];

      const [registerForm, { resetFields, validate }] = useForm({
        schemas,
        labelWidth: 100,
        baseColProps: { span: 24 },
        showActionButtonGroup: false,
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(() => {
        resetFields();
        setModalProps({ confirmLoading: false });
      });

      async function handleSubmit() {
        try {
          const params = await validate();

          if (params.password !== params.passwordRepeat) {
            createMessage.error('新密码两次输入不一致');
            return;
          }

          setModalProps({ confirmLoading: true });

          await resetPwd(params);

          createMessage.success('修改成功');

          setModalProps({ confirmLoading: false });
          closeModal();
        } catch (err) {
          setModalProps({ confirmLoading: false });
        }
      }

      return {
        registerForm,
        registerModal,
        handleSubmit,
      };
    },
  });
</script>
