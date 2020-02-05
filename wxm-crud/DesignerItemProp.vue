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
                                        <div style="text-align: right;display: inline-block;width: 70px;margin: 0 5px;">
                                            数据标识
                                        </div>
                                        <div style="display: inline-block;width: calc(100% - 130px);margin: 0 5px;">
                                            <a-input style="width: 100%;" v-model="col.dataIndex"></a-input>
                                        </div>
                                    </div>
                                </div>
                            </draggable>
                            <a-button type="link" style="margin: 10px;"
                                      @click="value.cols.push(
                                      {
                                        title:'',
                                        dataIndex:''
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
            <a-tab-pane tab="全局属性" key="2">
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
        props:['value'],
        watch:{
        },
        methods:{
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
