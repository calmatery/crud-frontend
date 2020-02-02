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
                        <a-form-item :validate-status="value.name&&value.name.trim()?'success':'error'"
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
    export default {
        name: "DesignerItemProp",
        components: {AFormItem},
        data(){
            return {
                form:null
            }
        },
        props:['value'],
        watch:{
        },
        methods:{
            testHandler(evt){
                console.log(evt)
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
    }
</style>
