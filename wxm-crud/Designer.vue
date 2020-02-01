<template>
    <div style="height: 100%;" class="wxm-crud-designer">
        <a-button @click="clickHandler">打印</a-button>
        <a-layout>
            <a-layout-sider :class="'left-sider'" :width="250">
                <div class="component-list-title">基础字段</div>
                <div class="component-list-container">
                    <draggable tag="div" :list="basicComponents" :sort="false"
                               :options="{group:{name: 'designer',pull:'clone'}}" >
                        <div class="component-icon" v-for="(item, index) in basicComponents" :key="index">
                            <i class="icon iconfont" :class="item._icon"></i>
                            <span>{{item.name}}</span>
                        </div>
                    </draggable>
                </div>
            </a-layout-sider>
            <a-layout-content>
                <designer-panel @selectedItemChange="(val)=>this.selectedItem=val" :list.sync="value.list"></designer-panel>
            </a-layout-content>
            <a-layout-sider :width="300">
                <designer-item-prop :value="selectedItem"></designer-item-prop>
            </a-layout-sider>
        </a-layout>
    </div>
</template>

<script>
    import './icon/iconfont.css'
    import {basicComponents, layoutComponents} from './componentsConfig.js'
    import Vue from 'vue';
    import { Button,Layout,Input,Form,DatePicker,Tabs } from 'ant-design-vue';
    import draggable from 'vuedraggable'
    import DesignerPanel from "./DesignerPanel";
    import DesignerItemProp from "./DesignerItemProp";
    Vue.component(Button.name, Button);
    Vue.component(Input.name, Input);
    Vue.component(DatePicker.name, DatePicker);
    Vue.component(DatePicker.MonthPicker.name, DatePicker.MonthPicker);
    Vue.component(DatePicker.RangePicker.name, DatePicker.RangePicker);
    Vue.component(DatePicker.WeekPicker.name, DatePicker.WeekPicker);
    Vue.component(Tabs.name, Tabs);
    Vue.component(Tabs.TabPane.name, Tabs.TabPane);
    Vue.component(Form.name, Form);
    Vue.component(Form.Item.name, Form.Item);
    Vue.component(Layout.name, Layout);
    Vue.component(Layout.Header.name, Layout.Header);
    Vue.component(Layout.Content.name, Layout.Content);
    Vue.component(Layout.Sider.name, Layout.Sider);
    Vue.component(Layout.Footer.name, Layout.Footer);
    Vue.component(draggable.name, draggable);
    export default {
        name: "Designer",
        components: {DesignerItemProp, DesignerPanel},
        data(){
            return{
                basicComponents,
                layoutComponents,
                value:{
                    list:[]
                },
                selectedItem:null
            }
        },
        methods:{
            handleMove (){
                return true
            },
            clickHandler() {
                console.log(this.value)
            }
        },
        watch:{
            value:{
                handler () {
                },
                deep: true
            }
        }
    }
</script>

<style>
    .wxm-crud-designer{
        color: #314659;
    }
    .wxm-crud-designer .ant-layout{
        background: rgba(0,0,0,0);
        height: 100%;
    }
    .wxm-crud-designer .ant-layout-sider{
        background-color: rgba(0,0,0,0);
        overflow: auto;
    }
    .wxm-crud-designer .ant-layout-content{
        border-left: 1px solid #e0e0e0;
        border-right: 1px solid #e0e0e0;
    }
    .wxm-crud-designer .left-sider .component-list-title{
        font-size: 14px;
        padding: 8px 14px;
    }

    .wxm-crud-designer .left-sider .component-list-container{
        padding: 0 12px 12px;
    }
    .wxm-crud-designer .component-icon{
        cursor: move;
        background-color: #F4F6FC;
        border: 1px solid #F4F6FC;
        float: left;
        width: 48%;
        margin: 1%;
        font-size: 12px;
        padding-left: 10px;
        height: 30px;
        line-height: 28px;
    }
    .wxm-crud-designer .component-icon i{
        font-size: 14px;
    }
    .wxm-crud-designer .component-icon:hover{
        border: 1px dashed #409eff;
    }

</style>
