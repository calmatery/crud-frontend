<template>
    <div style="height: 100%;" class="wxm-crud-designer">
        <a-layout>
            <a-layout-sider :class="'left-sider'" :width="250">
                <div class="component-list-title">基础字段</div>
                <div class="component-list-container">
                    <draggable tag="div" :list="basicComponents" :sort="false"
                               :group="{name: 'designer',pull:'clone',put:false}" >
                        <div class="component-icon" v-for="(item, index) in basicComponents" :key="index">
                            <i class="icon iconfont" :class="item._icon"></i>
                            <span>{{item.name}}</span>
                        </div>
                    </draggable>
                </div>
                <div class="component-list-title">布局字段</div>
                <div class="component-list-container">
                    <draggable tag="div" :list="layoutComponents" :sort="false"
                               :group="{name: 'designer',pull:'clone',put:false}" >
                        <div class="component-icon" v-for="(item, index) in layoutComponents" :key="index">
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
                        <i class="icon iconfont icon-preview"></i>预览
                    </a-button>
                    <a-button @click="value.list=[];value.props={}" type="link">
                        <i class="icon iconfont icon-trash"></i>清空
                    </a-button>
                    <a-button @click="jsonEditorVisible=true" type="link">
                        <i class="icon iconfont icon-json"></i>JSON序列化
                    </a-button>
                </div>
                <designer-panel :selected.sync="selectedItem"
                                :container-props="value.props"
                                :list.sync="value.list"></designer-panel>
            </a-layout-content>
            <a-layout-sider :width="300">
                <designer-item-prop :props="containerProps" :value="selectedItem"></designer-item-prop>
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
                 :width="'100%'" style="top:0px;"
                 :destroyOnClose="true"
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

            <x-form style="height: 100%;min-height: 450px;overflow: auto"
                    :value="formVal"
                    :container-props="value.props"
                    :parameter="value"></x-form>
        </a-modal>
    </div>
</template>

<script>
    import './icon/iconfont.css'
    import JSONEditor from 'jsoneditor/dist/jsoneditor.js'
    import 'jsoneditor/dist/jsoneditor.css'
    import {basicComponents, layoutComponents} from './componentsConfig.js'
    import Vue from 'vue';
    import { Icon, Button,Layout,Input,InputNumber,Radio,
        Form,DatePicker,Checkbox,Select,Table,
        Tabs,Modal,Row,Col,Divider,Popconfirm,
        message } from 'ant-design-vue';
    import draggable from 'vuedraggable'
    import DesignerPanel from "./DesignerPanel";
    import DesignerItemProp from "./DesignerItemProp";
    import DesignerItem from "./DesignerItem";
    import XScopeGateway from './XScopeGateway';
    import XForm from "./XForm";
    import XItem from "./XItem";
    Vue.component(Button.name, Button);
    Vue.component(Icon.name, Icon);
    Vue.component(Input.name, Input);
    Vue.component(Input.TextArea.name, Input.TextArea);
    Vue.component(InputNumber.name, InputNumber);
    Vue.component(Checkbox.name, Checkbox);
    Vue.component(Radio.Group.name, Radio.Group);
    Vue.component(Radio.Button.name, Radio.Button);
    Vue.component(Select.name, Select);
    Vue.component(Select.Option.name, Select.Option);
    Vue.component(Table.name, Table);
    Vue.component(DatePicker.name, DatePicker);
    Vue.component(DatePicker.MonthPicker.name, DatePicker.MonthPicker);
    Vue.component(DatePicker.RangePicker.name, DatePicker.RangePicker);
    Vue.component(Tabs.name, Tabs);
    Vue.component(Tabs.TabPane.name, Tabs.TabPane);
    Vue.component(Modal.name, Modal);
    Vue.component(Row.name, Row);
    Vue.component(Col.name, Col);
    Vue.component(Divider.name, Divider);
    Vue.component(Popconfirm.name, Popconfirm);
    Vue.component(Form.name, Form);
    Vue.component(Form.Item.name, Form.Item);
    Vue.component(Layout.name, Layout);
    Vue.component(Layout.Header.name, Layout.Header);
    Vue.component(Layout.Content.name, Layout.Content);
    Vue.component(Layout.Sider.name, Layout.Sider);
    Vue.component(Layout.Footer.name, Layout.Footer);
    Vue.component(draggable.name, draggable);
    Vue.component(DesignerPanel.name,DesignerPanel)
    Vue.component(DesignerItem.name,DesignerItem)
    Vue.component(XForm.name,XForm)
    Vue.component(XItem.name,XItem)
    Vue.component(XScopeGateway.name,XScopeGateway)
    export default {
        name: "Designer",
        components: {DesignerItemProp, DesignerPanel},
        created(){

        },
        mounted(){
        },
        data(){
            return{
                basicComponents,
                layoutComponents,
                containerProps:null,
                value:{
                    "props": {
                        "textAlign": ""
                    },
                    "list": [
                        {
                            "type": "scopeGateway",
                            "name": "作用域网关",
                            "list": [
                                {
                                    "type": "input",
                                    "name": "名称",
                                    "defaultValue": "",
                                    "placeholder": "",
                                    "key": "input_1581240148890_30942",
                                    "inline": true
                                },
                                {
                                    "type": "button",
                                    "name": "查询",
                                    "btnType": "primary",
                                    "key": "button_1580896611142_86318",
                                    "clickHandler": "scopeMessage(\"s1\")",
                                    "inline": true
                                }
                            ],
                            "key": "s1",
                            "props": {
                                "textAlign": "right;"
                            }
                        },
                        {
                            "type": "divider",
                            "name": "",
                            "orientation": "left",
                            "dashed": false,
                            "key": "divider_1581240190909_70993"
                        },
                        {
                            "type": "container",
                            "name": "容器",
                            "list": [
                                {
                                    "type": "button",
                                    "name": "新增",
                                    "btnType": "primary",
                                    "key": "button_1581240199163_35367",
                                    "clickHandler": "$rp.[modal_new].visible=true;"
                                }
                            ],
                            "key": "container_1581240236046_9634",
                            "props": {
                                "textAlign": "right;"
                            }
                        },
                        {
                            "type": "table",
                            "name": "报表",
                            "cols": [
                                {
                                    "title": "标识",
                                    "dataIndex": "id",
                                    "isSlot": false
                                },
                                {
                                    "title": "名称",
                                    "dataIndex": "name",
                                    "isSlot": false
                                },
                                {
                                    "title": "操作",
                                    "isSlot": true,
                                    "scopedSlots": {
                                        "customRender": "name1"
                                    }
                                }
                            ],
                            "slots": [
                                {
                                    "slot": "slot",
                                    "list": [
                                        {
                                            "type": "a",
                                            "name": "修改",
                                            "btnType": "",
                                            "key": "a_1581182559067_99492",
                                            "clickHandler": "$rp.[modal_update].visible=true;\n$rv.scope_update.id=:$s.record.id\n$rv.scope_update.name=:$s.record.name",
                                            "inline": true
                                        },
                                        {
                                            "type": "a",
                                            "name": "删除",
                                            "btnType": "",
                                            "key": "a_1581215369608_79251",
                                            "inline": true,
                                            "marginLeft": "20px",
                                            "href": "",
                                            "clickHandler": "result=[-user-info/{$s.record.id}]",
                                            "clickConfirm": true,
                                            "clickConfirmMsg": "确认要删除这条记录吗？"
                                        }
                                    ],
                                    "title": "name1",
                                    "props": {}
                                }
                            ],
                            "scopeListeners": [
                                {
                                    "scopeName": "s1",
                                    "handler": "$rp.[table1].loading=true;\n$v.table1=[user-info]\n$p.loading=false"
                                }
                            ],
                            "key": "table1",
                            "loading": false
                        },
                        {
                            "type": "modal",
                            "name": "模态窗",
                            "list": [
                                {
                                    "type": "scopeGateway",
                                    "name": "作用域网关",
                                    "list": [
                                        {
                                            "type": "input",
                                            "name": "名称",
                                            "defaultValue": "",
                                            "placeholder": "",
                                            "key": "name"
                                        }
                                    ],
                                    "key": "scope_new",
                                    "props": {}
                                }
                            ],
                            "visible": false,
                            "key": "modal_new",
                            "props": {},
                            "cancelHandler": "$p.visible=false;\n",
                            "okHandler": "$s.obj = {}\n$s.obj.name=:$rv.scope_new.name\nresult=[+user-info,$s.obj]\n$p.visible=false;\n"
                        },
                        {
                            "type": "modal",
                            "name": "新增",
                            "list": [
                                {
                                    "type": "scopeGateway",
                                    "name": "作用域网关",
                                    "list": [
                                        {
                                            "type": "input",
                                            "name": "标识",
                                            "defaultValue": "",
                                            "placeholder": "",
                                            "key": "id"
                                        },
                                        {
                                            "type": "input",
                                            "name": "名称",
                                            "defaultValue": "",
                                            "placeholder": "",
                                            "key": "name"
                                        }
                                    ],
                                    "key": "scope_update",
                                    "props": {}
                                }
                            ],
                            "visible": false,
                            "key": "modal_update",
                            "props": {},
                            "okHandler": "result=[>user-info/{$rv.scope_update.id},$rv.scope_update]\n$p.visible=false",
                            "cancelHandler": "$p.visible=false"
                        },
                        {
                            "type": "tabs",
                            "name": "标签页",
                            "tabs": [
                                {
                                    "name": "新标签页",
                                    "list": [
                                        {
                                            "type": "grid",
                                            "name": "栅格",
                                            "cols": [
                                                {
                                                    "span": 16,
                                                    "list": [
                                                        {
                                                            "type": "tabs",
                                                            "name": "标签页",
                                                            "tabs": [
                                                                {
                                                                    "name": "新标签页",
                                                                    "list": [
                                                                        {
                                                                            "type": "input",
                                                                            "name": "输入框",
                                                                            "defaultValue": "",
                                                                            "placeholder": "",
                                                                            "key": "input_1580652597670_31873"
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    "name": "新标签页",
                                                                    "list": [
                                                                        {
                                                                            "type": "input",
                                                                            "name": "输入框",
                                                                            "defaultValue": "",
                                                                            "placeholder": "",
                                                                            "key": "input_1580652600495_21520"
                                                                        }
                                                                    ]
                                                                }
                                                            ],
                                                            "key": "tabs_1580652578091_41625"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "span": 8,
                                                    "list": [
                                                        {
                                                            "type": "input",
                                                            "name": "输入框",
                                                            "defaultValue": "",
                                                            "placeholder": "",
                                                            "key": "input_1580652574935_21832"
                                                        }
                                                    ]
                                                }
                                            ],
                                            "key": "grid_1580652561414_92940"
                                        }
                                    ]
                                },
                                {
                                    "name": "标签页1",
                                    "list": [
                                        {
                                            "type": "grid",
                                            "name": "栅格",
                                            "cols": [
                                                {
                                                    "span": 12,
                                                    "list": [
                                                        {
                                                            "type": "input",
                                                            "name": "输入框",
                                                            "defaultValue": "",
                                                            "placeholder": "",
                                                            "key": "input_1580652543720_67280"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "span": 12,
                                                    "list": [
                                                        {
                                                            "type": "datePicker",
                                                            "name": "日期选择",
                                                            "placeholder": "",
                                                            "key": "datePicker_1580652545456_17128"
                                                        }
                                                    ]
                                                }
                                            ],
                                            "key": "grid_1580652525629_51372"
                                        }
                                    ]
                                },
                                {
                                    "name": "标签页2",
                                    "list": [
                                        {
                                            "type": "input",
                                            "name": "输入框",
                                            "defaultValue": "",
                                            "placeholder": "",
                                            "key": "input_1580652539542_30108"
                                        }
                                    ]
                                }
                            ],
                            "key": "tabs_1580652468112_81060"
                        },
                        {
                            "type": "divider",
                            "name": "分割线",
                            "orientation": "left",
                            "dashed": false,
                            "key": "divider_1580656501750_94572"
                        },
                        {
                            "type": "datePicker",
                            "name": "开始时间",
                            "placeholder": "",
                            "key": "datePicker_1580644935999_41360"
                        },
                        {
                            "type": "grid",
                            "name": "栅格",
                            "cols": [
                                {
                                    "span": 12,
                                    "list": [
                                        {
                                            "type": "grid",
                                            "name": "栅格",
                                            "cols": [
                                                {
                                                    "span": 12,
                                                    "list": [
                                                        {
                                                            "type": "input",
                                                            "name": "输入框",
                                                            "defaultValue": "123",
                                                            "placeholder": "",
                                                            "key": "input_1580644946729_81739"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "span": 12,
                                                    "list": [
                                                        {
                                                            "type": "input",
                                                            "name": "输入框",
                                                            "defaultValue": "456",
                                                            "placeholder": "",
                                                            "key": "input_1580644949456_22266"
                                                        }
                                                    ]
                                                }
                                            ],
                                            "key": "grid_1580644939545_96903"
                                        }
                                    ]
                                },
                                {
                                    "span": 12,
                                    "list": [
                                        {
                                            "type": "datePicker",
                                            "name": "日期选择",
                                            "placeholder": "选择日期",
                                            "key": "datePicker_1580644951549_67143"
                                        }
                                    ]
                                }
                            ],
                            "key": "grid_1580644937802_89385"
                        }
                    ]
                },
                formVal:{},
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
            },
            getContainer(val){
                let objs = []
                objs.push(this.value)
                while (objs.length>0){
                    let obj = objs.pop()
                    for (let key in obj) {
                        let item = obj[key]
                        if(Array.isArray(item)){
                            for (let i = 0; i < item.length; i++) {
                                let arrayItem = item[i]
                                if(arrayItem==val){
                                    return obj
                                }
                                objs.push(arrayItem)
                            }
                        }
                    }
                }
            }
        },
        watch:{
            value:{
                handler () {
                },
                deep: true
            },
            'formVal.text1'(val){
                console.log('formVal.text1发送变化了:'+val)
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
            },
            selectedItem(val){
                if(val!=null){
                    let container = this.getContainer(val)
                    if(!container.props){
                        container.props={}
                    }
                    this.containerProps=container.props
                }
                else{
                    this.containerProps={}
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
        overflow: hidden;
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
    .wxm-crud-designer .designerPanel>div{
        padding-bottom: 20px;
    }

</style>
