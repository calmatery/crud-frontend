<template>
    <div style="padding: 0px 10px;">
        <a-tabs defaultActiveKey="1">
            <a-tab-pane tab="字段属性" key="1">
                <div v-if="value!=null">
                    <a-form :layout="'vertical'">
                        <a-form-item :validate-status="keyValidate"
                                     :help="keyValidate=='success'?'':'内容不能为空！以字母开头，由小写字母、大写字母、数字或下划线组成！'"
                                     label="标识">
                            <a-input v-model="value.key"></a-input>
                        </a-form-item>

                        <a-form-item v-if="value.type=='divider'"
                                     label="标题">
                            <a-input v-model="value.name"></a-input>
                        </a-form-item>
                        <a-form-item v-else :validate-status="value.name&&value.name.trim()?'success':'error'"
                                     :help="value.name&&value.name.trim()?'':'内容不能为空！'"
                                     label="标题">
                            <a-input v-model="value.name"></a-input>
                        </a-form-item>

                        <a-form-item v-if="value.type=='a'&&!value.clickConfirm" label="链接地址">
                            <a-textarea v-model="value.href"></a-textarea>
                        </a-form-item>

                        <a-form-item v-if="['button','a'].indexOf(value.type)>=0" label="确认提示">
                            <a-checkbox v-model="value.clickConfirm">开启</a-checkbox>
                        </a-form-item>

                        <a-form-item v-if="value.clickConfirm" label="提示信息">
                            <a-input v-model="value.clickConfirmMsg"></a-input>
                        </a-form-item>

                        <a-form-item v-if="['button','a'].indexOf(value.type)>=0" label="点击事件">
                            <a-textarea v-model="value.clickHandler"></a-textarea>
                        </a-form-item>


                        <a-form-item v-if="value.type=='button'" label="按钮类型">
                            <a-select v-model="value.btnType"
                                      defaultValue="">
                                <a-select-option value="primary">主按钮</a-select-option>
                                <a-select-option value="">次按钮</a-select-option>
                                <a-select-option value="dashed">虚线按钮</a-select-option>
                                <a-select-option value="danger">危险按钮</a-select-option>
                                <a-select-option value="link">链接按钮</a-select-option>
                            </a-select>
                        </a-form-item>

                        <a-form-item v-if="value.type=='modal'" label="确认事件">
                            <a-textarea v-model="value.okHandler"></a-textarea>
                        </a-form-item>
                        <a-form-item v-if="value.type=='modal'" label="取消事件">
                            <a-textarea v-model="value.cancelHandler"></a-textarea>
                        </a-form-item>

                        <a-form-item label="行内块布局">
                            <a-checkbox v-model="value.inline">开启</a-checkbox>
                        </a-form-item>

                        <a-form-item label="边距">
                            <div style="display: inline-block;width: 50%;">
                                <label style="display: inline-block;width:40px;text-align: right;">上</label>
                                <a-input style="width: calc(100% - 50px);margin: 0 5px;" v-model="value.marginTop"></a-input>
                            </div>
                            <div style="display: inline-block;width: 50%;">
                                <label style="display: inline-block;width:40px;text-align: right;">右</label>
                                <a-input style="width: calc(100% - 50px);margin: 0 5px;" v-model="value.marginRight"></a-input>
                            </div>
                            <div style="display: inline-block;width: 50%;">
                                <label style="display: inline-block;width:40px;text-align: right;">下</label>
                                <a-input style="width: calc(100% - 50px);margin: 0 5px;" v-model="value.marginBottom"></a-input>
                            </div>
                            <div style="display: inline-block;width: 50%;">
                                <label style="display: inline-block;width:40px;text-align: right;">左</label>
                                <a-input style="width: calc(100% - 50px);margin: 0 5px;" v-model="value.marginLeft"></a-input>
                            </div>
                        </a-form-item>

                        <a-form-item v-if="['input'].indexOf(value.type)>=0" label="默认值">
                            <a-input v-model="value.defaultValue"></a-input>
                        </a-form-item>
                        <a-form-item v-if="['datePicker'].indexOf(value.type)>=0" label="默认值">
                            <a-date-picker v-model="value.defaultValue" format="YYYY-MM-DD"></a-date-picker>
                        </a-form-item>

                        <a-form-item v-if="['input','datePicker'].indexOf(value.type)>=0" label="占位内容">
                            <a-input v-model="value.placeholder"></a-input>
                        </a-form-item>
                        <a-form-item v-if="value.type=='grid'" label="列配置">
                            <draggable handle=".drag"
                                       ghostClass="dragging"
                                       v-model="value.cols">
                                <div v-for="(col,i) in value.cols" :key="i" :style="i>0?'margin-top: 10px;':''">
                                    <div style="display: inline-block;vertical-align: middle;">
                                        <i class="drag icon iconfont icon-yidongdaohang"
                                           style="font-size: 20px;margin-top:3px;color:#9c9c9c;cursor:move;"></i>
                                    </div>
                                    <div style="display: inline-block;width: calc(100% - 50px);margin: 0 5px;">
                                        <a-input-number style="width: 100%;" v-model="col.span"></a-input-number>
                                    </div>
                                    <div style="display: inline-block;vertical-align: middle;">
                                        <i class="icon iconfont icon-shanchu"
                                           @click="value.cols.splice(i,1)"
                                           style="font-size: 20px;margin-top:3px;color:#ea4e1d;cursor: pointer;"></i>
                                    </div>
                                </div>
                            </draggable>
                            <a-button type="link" style="margin: 10px;"
                                      @click="value.cols.push({span:12,list:[]})">添加列</a-button>
                        </a-form-item>
                        <a-form-item v-if="value.type=='tabs'" label="标签页配置">
                            <draggable handle=".drag"
                                       ghostClass="dragging"
                                       v-model="value.tabs">
                                <div v-for="(tab,i) in value.tabs" :key="i" :style="i>0?'margin-top: 10px;':''">
                                    <div style="display: inline-block;vertical-align: middle;">
                                        <i class="drag icon iconfont icon-yidongdaohang"
                                           style="font-size: 20px;margin-top:3px;color:#9c9c9c;cursor:move;"></i>
                                    </div>
                                    <div style="display: inline-block;width: calc(100% - 50px);margin: 0 5px;">
                                        <a-input style="width: 100%;" v-model="tab.name"></a-input>
                                    </div>
                                    <div style="display: inline-block;vertical-align: middle;">
                                        <i class="icon iconfont icon-shanchu" v-if="value.tabs.length>1"
                                           @click="value.tabs.splice(i,1)"
                                           style="font-size: 20px;margin-top:3px;color:#ea4e1d;cursor: pointer;"></i>
                                    </div>
                                </div>
                            </draggable>
                            <a-button type="link" style="margin: 10px;"
                                      @click="value.tabs.push({name:'新标签页',list:[]})">添加列</a-button>
                        </a-form-item>

                        <a-form-item v-if="value.type=='divider'"
                                     label="是否虚线">
                            <a-checkbox v-model="value.dashed">是</a-checkbox>
                        </a-form-item>
                        <a-form-item v-if="value.type=='divider'"
                                     label="位置">
                            <a-select defaultValue="left" v-model="value.orientation">
                                <a-select-option value="left">左</a-select-option>
                                <a-select-option value="center">中</a-select-option>
                                <a-select-option value="right">右</a-select-option>
                            </a-select>
                        </a-form-item>

                        <a-form-item v-if="value.type=='table'" label="列配置">
                            <draggable handle=".drag"
                                       ghostClass="dragging"
                                       v-model="value.cols">
                                <div v-for="(col,i) in value.cols" :key="i" :style="i>0?'margin-top: 10px;':''">
                                    <div style="display: inline-block;vertical-align: middle;">
                                        <i class="drag icon iconfont icon-yidongdaohang"
                                           style="font-size: 20px;margin-top:3px;color:#9c9c9c;cursor:move;"></i>
                                    </div>
                                    <div style="text-align: right;display: inline-block;width: 50px;margin: 0 5px;">
                                        名称
                                    </div>
                                    <div style="display: inline-block;width: calc(100% - 130px);margin: 0 5px;">
                                        <a-input style="width: 100%;" v-model="col.title"></a-input>
                                    </div>
                                    <div style="display: inline-block;vertical-align: middle;">
                                        <i class="icon iconfont icon-shanchu"
                                           @click="value.cols.splice(i,1)"
                                           style="font-size: 20px;margin-top:3px;color:#ea4e1d;cursor: pointer;"></i>
                                    </div>
                                    <div style="display: inline-block;vertical-align: middle;">
                                        <i v-if="tableColOpened==i" class="icon iconfont icon-xiangshangshouqi-yuankuang"
                                           @click="tableColOpened=-1"
                                           style="font-size: 20px;margin-top:3px;color:#ea4e1d;cursor: pointer;"></i>
                                        <i v-else class="icon iconfont icon-xiangxiazhankai-yuankuang"
                                           @click="tableColOpened=i"
                                           style="font-size: 20px;margin-top:3px;color:#ea4e1d;cursor: pointer;"></i>
                                    </div>
                                    <div v-if="tableColOpened==i">

                                        <template v-if="col.isSlot==true">
                                            <div style="text-align: right;display: inline-block;width: 70px;margin: 0 5px;">
                                                插槽
                                            </div>
                                            <div style="display: inline-block;width: calc(100% - 130px);margin: 0 5px;">
                                                <a-input v-if="col.scopedSlots"
                                                         style="width: 100%;" v-model="col.scopedSlots.customRender"></a-input>
                                            </div>
                                        </template>

                                        <template v-else>
                                            <div style="text-align: right;display: inline-block;width: 70px;margin: 0 5px;">
                                                数据标识
                                            </div>
                                            <div style="display: inline-block;width: calc(100% - 130px);margin: 0 5px;">
                                                <a-input style="width: 100%;" v-model="col.dataIndex"></a-input>
                                            </div>
                                        </template>

                                        <div style="display: inline-block;vertical-align: middle;">
                                            <i class="icon iconfont icon-zhuanhuan"
                                               @click="transferHandler(col)"
                                               style="font-size: 18px;margin-top:3px;color:#ea4e1d;cursor: pointer;"></i>
                                        </div>
                                    </div>
                                </div>
                            </draggable>
                            <a-button type="link" style="margin: 10px;"
                                      @click="value.cols.push(
                                      {
                                        title:'',
                                        dataIndex:'',
                                        isSlot:false,
                                        scopedSlots:{}
                                      })">添加列</a-button>
                        </a-form-item>


                        <a-form-item v-if="value.type=='table'" label="插槽">
                            <draggable handle=".drag"
                                       ghostClass="dragging"
                                       v-model="value.slots">
                                <div v-for="(slot,i) in value.slots" :key="i" :style="i>0?'margin-top: 10px;':''">
                                    <div style="display: inline-block;vertical-align: middle;">
                                        <i class="drag icon iconfont icon-yidongdaohang"
                                           style="font-size: 20px;margin-top:3px;color:#9c9c9c;cursor:move;"></i>
                                    </div>
                                    <div style="text-align: right;display: inline-block;width: 50px;margin: 0 5px;">
                                        名称
                                    </div>
                                    <div style="display: inline-block;width: calc(100% - 110px);margin: 0 5px;">
                                        <a-input style="width: 100%;" v-model="slot.title"></a-input>
                                    </div>
                                    <div style="display: inline-block;vertical-align: middle;">
                                        <i class="icon iconfont icon-shanchu"
                                           @click="value.slots.splice(i,1)"
                                           style="font-size: 20px;margin-top:3px;color:#ea4e1d;cursor: pointer;"></i>
                                    </div>
                                </div>
                            </draggable>
                            <a-button type="link" style="margin: 10px;"
                                      @click="value.slots.push(
                                      {
                                        slot:'slot',
                                        list:[]
                                      })">添加列</a-button>
                        </a-form-item>


                        <a-form-item v-if="value.type=='table'" label="作用域消息监听">
                            <draggable handle=".drag"
                                       ghostClass="dragging"
                                       v-model="value.cols">
                                <div v-for="(scopeListener,i) in value.scopeListeners"
                                     :key="i" :style="i>0?'margin-top: 10px;':''">
                                    <div style="overflow: hidden;">
                                        <div style="float: left;vertical-align: middle;">
                                            <i class="drag icon iconfont icon-yidongdaohang"
                                               style="font-size: 20px;margin-top:3px;color:#9c9c9c;cursor:move;"></i>
                                        </div>
                                        <div style="text-align: right;float: left;width: 50px;margin: 4px 5px 0;">
                                            作用域
                                        </div>
                                        <div style="float: left;width: calc(100% - 130px);margin: 0 5px;">
                                            <a-input style="width: 100%;" v-model="scopeListener.scopeName"></a-input>
                                        </div>
                                        <div style="float: left;vertical-align: middle;">
                                            <i class="icon iconfont icon-shanchu"
                                               @click="value.scopeListeners.splice(i,1)"
                                               style="font-size: 20px;margin-top:3px;color:#ea4e1d;cursor: pointer;"></i>
                                        </div>
                                        <div style="float: left;vertical-align: middle;">
                                            <i v-if="tableScopeOpened==i" class="icon iconfont icon-xiangshangshouqi-yuankuang"
                                               @click="tableScopeOpened=-1"
                                               style="font-size: 20px;margin-top:3px;color:#ea4e1d;cursor: pointer;"></i>
                                            <i v-else class="icon iconfont icon-xiangxiazhankai-yuankuang"
                                               @click="tableScopeOpened=i"
                                               style="font-size: 20px;margin-top:3px;color:#ea4e1d;cursor: pointer;"></i>
                                        </div>
                                    </div>
                                    <div style="overflow:hidden;" v-if="tableScopeOpened==i">
                                        <div style="text-align: right;float: left;width: 70px;margin: 4px 5px 0;">
                                            响应
                                        </div>
                                        <div style="float: left;width: calc(100% - 130px);margin: 0 5px;">
                                            <a-textarea style="width: 100%;" v-model="scopeListener.handler"></a-textarea>
                                        </div>
                                    </div>
                                </div>
                            </draggable>
                            <a-button type="link" style="margin: 10px;"
                                      @click="value.scopeListeners.push(
                                      {
                                        scopeName:'',
                                        handler:''
                                      })">添加列</a-button>
                        </a-form-item>

                    </a-form>
                </div>
            </a-tab-pane>
            <a-tab-pane tab="容器属性" key="2">
                <a-form v-if="props" :layout="'vertical'">
                    <a-form-item label="对齐方式">
                        <a-radio-group v-model="props.textAlign" defaultValue="" buttonStyle="solid">
                            <a-radio-button value="">默认</a-radio-button>
                            <a-radio-button value="left;">左对齐</a-radio-button>
                            <a-radio-button value="center;">居中</a-radio-button>
                            <a-radio-button value="right;">右对齐</a-radio-button>
                        </a-radio-group>
                    </a-form-item>
                </a-form>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
    import AFormItem from "ant-design-vue/es/form/FormItem";
    import ATextarea from "ant-design-vue/es/input/TextArea";
    export default {
        name: "DesignerItemProp",
        components: {ATextarea, AFormItem},
        data(){
            return {
                form:null,
                tableColOpened:-1,
                tableScopeOpened:-1
            }
        },
        props:['value','props'],
        watch:{
        },
        methods:{
            transferHandler(col){
                console.log(col)
                col.isSlot=(!col.isSlot)
                if(col.isSlot){
                    col.scopedSlots={ customRender: col.dataIndex }
                    col.dataIndex = undefined
                }
                else {
                    col.dataIndex=col.scopedSlots.customRender
                    col.scopedSlots=undefined
                }
            }
        },
        computed:{
            keyValidate(){
                return this.value.key
                    &&/[a-zA-Z][a-zA-Z_\d]*/
                    .test(this.value.key)?
                    'success':'error';
            }
        }
    }
</script>

<style scoped>
    .dragging{
        border: 2px solid red;
        width: 100%;
        height: 0px;
        overflow: hidden;
    }
</style>
