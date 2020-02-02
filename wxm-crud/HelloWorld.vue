<template>
  <div>
    <a-input v-if="value" v-model="value[param.key]"></a-input>
  </div>
</template>

<script>
    import Vue from 'vue'
    import {Input} from 'ant-design-vue'
    Vue.component(Input.name,Input)
    export default {
        props:['value','param'],
        created(){
        },
        data() {
            return {
                formLayout: 'horizontal'
            };
        }
    };
</script>
