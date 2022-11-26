<template>
  <Form :model="formParams" :label-col="{ span: 3 }" :wrapper-col="{ span: 8 }">
    <template v-for="item in formParams" :key="item.id">
      <FormItem>
        <template #label>
          <Tooltip v-if="item.remark" :title="item.remark">
            <Icon icon="ant-design:question-circle-outlined" class="mr-1" />
          </Tooltip>
          <span>{{ item.name }}</span>
        </template>
        <template v-if="item.type == 'number'">
          <InputNumber v-model:value="item.value" />
        </template>
        <template v-else-if="item.type == 'textarea'">
          <ATextarea v-model:value="item.value" />
        </template>
        <template v-else-if="item.type == 'password'">
          <InputPassword v-model:value="item.value" />
        </template>
        <template v-else-if="item.type == 'select'">
          <ASelect v-model:value="item.value">
            <SelectOption v-for="(one, index) in item.options" :key="index" :value="one">
              {{ one }}
            </SelectOption>
          </ASelect>
        </template>
        <template v-else-if="item.type == 'radio'">
          <ARadioGroup name="item.name" v-model:value="item.value">
            <ARadio v-for="(one, index) in item.options" :key="index" :value="one">
              {{ one }}
            </ARadio>
          </ARadioGroup>
        </template>
        <template v-else-if="item.type == 'checkbox'">
          <ACheckboxGroup v-model:value="item.value">
            <ACheckbox v-for="(one, index) in item.options" :key="index" :value="one">
              {{ one }}
            </ACheckbox>
          </ACheckboxGroup>
        </template>
        <template
          v-else-if="
            item.type == 'image' ||
            item.type == 'images' ||
            item.type == 'file' ||
            item.type == 'files'
          "
        >
          <CustomUpload
            v-model:value="item.value"
            :multiple="item.type == 'images' || item.type == 'files'"
            :accept="item.type == 'image' || item.type == 'images' ? 'image' : '*'"
            :listType="item.type == 'image' || item.type == 'images' ? 'picture' : 'text'"
          />
        </template>
        <template v-else>
          <Input v-model:value="item.value" />
        </template>
      </FormItem>
    </template>
    <FormItem v-auth="'system.configs.store'" :wrapper-col="{ span: 8, offset: 3 }">
      <a-button type="primary" :loading="loading" @click="handleSubmit">保存</a-button>
    </FormItem>
  </Form>
</template>

<script lang="ts">
  import { defineComponent, ref, toRefs, onMounted } from 'vue';
  import {
    Form,
    FormItem,
    Input,
    InputNumber,
    InputPassword,
    Select,
    SelectOption,
    RadioGroup,
    Radio,
    CheckboxGroup,
    Checkbox,
    Tooltip,
  } from 'ant-design-vue';

  import { Icon } from '/@/components/Icon';
  import { useMessage } from '/@/hooks/web/useMessage';
  import CustomUpload from '/@/components/CustomUpload/index.vue';

  import { configsApi } from '/@/api/sys/config';

  export default defineComponent({
    name: 'ConfigsForm',
    components: {
      Form,
      FormItem,
      Input,
      InputNumber,
      InputPassword,
      ATextarea: Input.Textarea,
      ASelect: Select,
      SelectOption,
      ARadioGroup: RadioGroup,
      ARadio: Radio,
      ACheckboxGroup: CheckboxGroup,
      ACheckbox: Checkbox,
      Tooltip,
      Icon,
      CustomUpload,
    },
    props: {
      group: {
        type: String,
        required: true,
      },
      types: {
        type: Array as PropType<Recordable[]>,
        required: true,
      },
      groups: {
        type: Array as PropType<Recordable[]>,
        required: true,
      },
    },
    setup(props) {
      const loading = ref(false);
      const { group } = toRefs(props);
      const { createMessage } = useMessage();
      const formParams = ref<Recordable[]>([]);

      onMounted(() => {
        getConfig();
      });

      async function getConfig() {
        try {
          const data = await configsApi.list({ group: group.value });

          formParams.value = data;
        } catch (err) {
          console.log('err: ', err);
        }
      }

      async function handleSubmit() {
        loading.value = true;

        try {
          const data = formParams.value.map((item: Recordable) => {
            const isUpload =
              item.type === 'image' ||
              item.type === 'images' ||
              item.type === 'file' ||
              item.type === 'files';

            return {
              id: item.id,
              type: item.type,
              value: isUpload
                ? item.value.map((one: Recordable) => {
                    return {
                      url: one.url,
                      name: one.name,
                    };
                  })
                : item.value,
            };
          });

          await configsApi.update({ data });

          loading.value = false;
          createMessage.success('保存成功');
        } catch (err) {
          loading.value = false;
        }
      }

      return {
        loading,
        formParams,
        handleSubmit,
      };
    },
  });
</script>
