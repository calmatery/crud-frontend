<template>
  <div id="app">
      <designer></designer>
      <!--<input v-if="formVal" v-model="formVal['inp3']">-->
      <!--<a-input defaultValue="123"-->
               <!--v-model="formVal"></a-input>-->
      <!--<el-input-number v-if="formVal" v-model="formVal.a" placeholder="请输入内容"></el-input-number>-->
      <!--<a-input v-if="formVal" v-model="formVal.a" placeholder="请输入内容"></a-input>-->
      <!--<el-button @click="clickHandler">默认按钮</el-button>-->
      <!--<hello-world :value="formVal" :param="jsonObject"></hello-world>-->
  </div>
</template>

<script>
import Designer from "../wxm-crud/Designer";
// import HelloWorld from '../wxm-crud/HelloWorld'
// import Vue from 'vue'
// import ElementUI from 'element-ui';
// import {Input} from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// import {InputNumber,Input} from 'ant-design-vue'
// Vue.component(InputNumber.name,InputNumber)
// Vue.component(Input.name,Input)
// Vue.use(ElementUI);
export default {
  name: 'app',
  components: {
      // HelloWorld,
      Designer
  },

    created(){
      console.log(this)
        // this.formVal={inp3:123}
        // this.$set('formVal',{})
        // this.formVal = {}
        // this.formVal.a={}
        // this.$set('formVal.inp3',123)
        // this.$nextTick(function(){
        //     this.formVal.a=123
        // this.$set(this.formVal,'a',123)
        // })
        // this.formVal = formVal

    },
    data(){
        // formVal = {}
        // this.formVal["inp3"]=123
      return {
          // formVal:null,
          jsonObject:null,
          formVal:null
      }
    },
    methods:{
        clickHandler(){
            this.formVal.a=123
        }
    }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
    height: 100%;
}
</style>
