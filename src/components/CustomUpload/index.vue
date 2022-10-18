<template>
  <Upload
    :action="uploadUrl"
    :headers="uploadHeaders"
    :multiple="multiple"
    :accept="accepts"
    :listType="listType"
    :fileList="fileList"
    @change="handleChange"
  >
    <a-button>上传</a-button>
  </Upload>
</template>

<script lang="ts">
  import { defineComponent, ref, toRefs, reactive, computed } from 'vue';
  import { Upload } from 'ant-design-vue';
  import type { UploadChangeParam, UploadProps } from 'ant-design-vue';

  import { useGlobSetting } from '/@/hooks/setting';
  import { getToken } from '/@/utils/auth';

  export default defineComponent({
    name: 'CustomUpload',
    components: { Upload },
    props: {
      value: {
        type: Array,
        default: () => [],
      },
      listType: {
        type: String as PropType<'text' | 'picture'>,
        default: 'text',
      },
      accept: {
        type: String,
        default: '*',
      },
      multiple: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:value'],
    setup(props, { emit }) {
      const { value, accept, multiple } = toRefs(props);

      const initList: UploadProps['fileList'] = value.value.map(
        (item: Recordable, index: number) => {
          return {
            uid: `${index}`,
            status: 'done',
            url: item.url,
            name: item.name,
          };
        },
      );

      const fileList = ref<UploadProps['fileList']>(initList);

      const accepts = computed(() => {
        if (accept.value == 'image') {
          return '.png,.jpg,.jpeg,.gif,.webp,.bmp';
        } else {
          return accept.value;
        }
      });

      const globSetting = useGlobSetting();
      const uploadUrl = `${globSetting.apiUrl}${globSetting.urlPrefix}/upload`;
      const uploadHeaders = reactive({ authorization: `Bearer ${getToken()}` });

      function handleChange(info: UploadChangeParam) {
        let resFileList = [...info.fileList];

        if (!multiple.value) resFileList = resFileList.slice(-1);

        resFileList = resFileList.map((file) => {
          if (file.response) {
            const { data } = file.response;
            file.url = data.url;
          }
          return file;
        });

        fileList.value = resFileList;

        emit(
          'update:value',
          resFileList.map((item) => {
            return {
              url: item.url,
              name: item.name,
            };
          }),
        );
      }

      return {
        accepts,
        fileList,
        uploadUrl,
        uploadHeaders,
        handleChange,
      };
    },
  });
</script>
