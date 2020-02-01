<template>
    <div style="height: 100%;" class="wxm-crud-designer">
        <a-layout>
            <a-layout-sider :class="'left-sider'" :width="250">
                <div class="component-list-title">基础字段</div>
                <div class="component-list-container">
                    <draggable tag="div" :list="basicComponents" :sort="false"
                               :group="{name: 'designer',pull:'clone'}" >
                        <div class="component-icon" v-for="(item, index) in basicComponents" :key="index">
                            <i class="icon iconfont" :class="item._icon"></i>
                            <span>{{item.name}}</span>
                        </div>
                    </draggable>
                </div>
            </a-layout-sider>
            <a-layout-content>
                <div style="padding:5px 10px 5px 0px;text-align: right;border-bottom: 1px solid #e0e0e0;">
                    <a-button href="https://github.com/calmatery/crud-frontend" type="link">
                        GitHub
                    </a-button>
                    <a-button href="https://gitee.com/calmatery/crud-frontend" type="link">
                        Gitee
                    </a-button>
                    <a-button @click="previewHandler" type="link">
                        <a-icon type="eye" /><span style="margin: 0px">预览</span>
                    </a-button>
                    <a-button @click="value.list=[]" type="link">
                        <i class="icon iconfont icon-trash"></i>清空
                    </a-button>
                    <a-button @click="jsonEditorVisible=true" type="link">
                        <i class="icon iconfont icon-json"></i>JSON序列化
                    </a-button>
                </div>
                <designer-panel @selectedItemChange="(val)=>this.selectedItem=val" :list.sync="value.list"></designer-panel>
            </a-layout-content>
            <a-layout-sider :width="300">
                <designer-item-prop :value="selectedItem"></designer-item-prop>
            </a-layout-sider>
        </a-layout>
        <a-modal okText="确认" cancelText="取消"
                 :width="800" style="top: 20px;"
                 title="JSON字符串" @cancel="jsonEditorVisible=false"
                 @ok="jsonChangeHandler" :visible="jsonEditorVisible">
            <div style="height: 350px" ref="jsonEditor">
            </div>
        </a-modal>
        <a-modal @cancel="previewVisible=false"
                 :width="800" style="top: 20px;"
                 destroyOnClose="true"
                 title="预览" :visible="previewVisible">
            <template slot="footer">
                <div style="text-align: center">
                    <a-button @click="getDateHandler"
                            style="right: 50px" key="submit"
                            type="primary">
                        获取数据
                    </a-button>
                    <a-button @click="previewVisible=false">取消</a-button>
                </div>
            </template>

            <x-from style="height: 400px;overflow: auto"
                    :value="formVal"
                    :parameter="value"></x-from>
        </a-modal>
    </div>
</template>

<script>
    import './icon/iconfont.css'
    import JSONEditor from 'jsoneditor/dist/jsoneditor.js'
    import 'jsoneditor/dist/jsoneditor.css'
    import {basicComponents, layoutComponents} from './componentsConfig.js'
    import Vue from 'vue';
    import { Icon, Button,Layout,Input,Form,DatePicker,Tabs,Modal,message } from 'ant-design-vue';
    import draggable from 'vuedraggable'
    import DesignerPanel from "./DesignerPanel";
    import DesignerItemProp from "./DesignerItemProp";
    import XFrom from "./XFrom";
    Vue.component(Button.name, Button);
    Vue.component(Icon.name, Icon);
    Vue.component(Input.name, Input);
    Vue.component(DatePicker.name, DatePicker);
    Vue.component(DatePicker.MonthPicker.name, DatePicker.MonthPicker);
    Vue.component(DatePicker.RangePicker.name, DatePicker.RangePicker);
    Vue.component(Tabs.name, Tabs);
    Vue.component(Modal.name, Modal);
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
        components: {XFrom, DesignerItemProp, DesignerPanel},
        mounted(){
        },
        data(){
            return{
                basicComponents,
                layoutComponents,
                value:{
                    list:[]
                },
                formVal:null,
                selectedItem:null,
                jsonEditor:null,
                jsonEditorVisible:false,
                jsonEditorInited:false,
                previewVisible:false
            }
        },
        methods:{
            getDateHandler() {
                console.log(this.formVal)
                message.info(JSON.stringify(this.formVal));
            },
            previewHandler(){
                this.formVal={}
                this.previewVisible=true
            },
            jsonChangeHandler(){
                try{
                    this.value = this.jsonEditor.get()
                    this.jsonEditorVisible=false
                }
                catch(err){
                    console.error(err)
                    message.error('JSON格式异常！');
                }
            }
        },
        watch:{
            value:{
                handler () {
                },
                deep: true
            },
            jsonEditorVisible(val){
                if(val){
                    this.$nextTick(function(){
                        if(!this.jsonEditorInited){
                            let options = {
                                mode: "code",
                                mainMenuBar:false,
                                statusBar:false
                            };
                            this.jsonEditor = new JSONEditor(this.$refs.jsonEditor,options,this.value)
                            this.jsonEditorInited = true
                        }
                        else{
                            this.jsonEditor.set(this.value)
                        }
                    })
                }
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
