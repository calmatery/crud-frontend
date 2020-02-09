<template>
    <div :style="(parameter.inline?'display: inline-block;':'')
            +(parameter.marginTop?'margin-top:'+parameter.marginTop+';':'')
            +(parameter.marginRight?'margin-right:'+parameter.marginRight+';':'')
            +(parameter.marginBottom?'margin-bottom:'+parameter.marginBottom+';':'')
            +(parameter.marginLeft?'margin-left:'+parameter.marginLeft+';':'')">
        <template v-if="parameter.type=='input'">
            <designer-form-item :value="parameter">
                <a-form-item>
                    <a-input :placeholder="parameter.placeholder"
                             v-model="value[parameter.key]"></a-input>
                </a-form-item>
            </designer-form-item>
        </template>

        <template v-if="parameter.type=='a'">
            <a-popconfirm v-if="parameter.clickConfirm"
                          :title="parameter.clickConfirmMsg"
                          okText="是" cancelText="否"
                          @confirm="btnClickHandler(record)">
                <a href="javascript:;">{{parameter.name}}</a>
            </a-popconfirm>
            <a v-else @click="btnClickHandler(record)"
               :href="(parameter.clickHandler||!parameter.href)?'javascript:;':parameter.href">{{parameter.name}}</a>
        </template>

        <template v-if="parameter.type=='button'">
            <a-popconfirm v-if="parameter.clickConfirm"
                          :title="parameter.clickConfirmMsg"
                          okText="是" cancelText="否"
                          @confirm="btnClickHandler(record)">
                <a-button :type="parameter.btnType">{{parameter.name}}</a-button>
            </a-popconfirm>
            <a-button v-else :type="parameter.btnType"
                      @click="btnClickHandler(record)">{{parameter.name}}</a-button>
        </template>

        <template v-if="parameter.type=='datePicker'">
            <designer-form-item :value="parameter">
                <a-form-item>
                    <a-date-picker :placeholder="parameter.placeholder"
                                   v-model="value[parameter.key]"></a-date-picker>
                </a-form-item>
            </designer-form-item>
        </template>
        <template v-if="parameter.type=='table'">
            <a-table :columns="parameter.cols"
                     :dataSource="value[parameter.key]"
                     :loading="parameter.loading"
                     rowKey="id"
                     bordered>
                    <template v-for="(item,i) in parameter.slots" :slot="item.title" slot-scope="record" >
                        <x-form :key="i" style="overflow: hidden" :value="value"
                                @xMessage="(val)=>{$emit('xMessage',val)}"
                                :param-path="paramPath"
                                :not-root-form="true"
                                :root="vRoot"
                                :record="record"
                                :parameter="item.list"></x-form>
                    </template>
            </a-table>
        </template>


        <template v-if="parameter.type=='grid'">
            <a-row>
                <a-col v-for="(col,i) in parameter.cols" :span="col.span" :key="i">
                    <x-form style="overflow: hidden" :value="value"
                            @xMessage="(val)=>{$emit('xMessage',val)}"
                            :param-path="paramPath"
                            :not-root-form="true"
                            :container-props="col.props"
                            ref="children"
                            :root="vRoot"
                            :parameter="col.list"></x-form>
                </a-col>
            </a-row>
        </template>

        <template v-if="parameter.type=='tabs'">
            <a-tabs :default-active-key="0">
                <a-tab-pane v-for="(tab,i) in parameter.tabs" :key="i" :tab="tab.name">
                    <x-form style="overflow: hidden" :value="value"
                            :param-path="paramPath"
                            :not-root-form="true"
                            :container-props="tab.props"
                            ref="children"
                            :root="vRoot"
                            @xMessage="(val)=>{$emit('xMessage',val)}"
                            :parameter="tab.list"></x-form>
                </a-tab-pane>
            </a-tabs>
        </template>

        <template v-if="parameter.type=='divider'">
            <template v-if="parameter.orientation=='center'">
                <a-divider :dashed="parameter.dashed"
                           v-if="parameter.name">{{parameter.name}}</a-divider>
                <a-divider :dashed="parameter.dashed" v-else></a-divider>
            </template>
            <template v-else>
                <a-divider :orientation="parameter.orientation"
                           :dashed="parameter.dashed" v-if="parameter.name">{{parameter.name}}</a-divider>
                <a-divider :orientation="parameter.orientation" :dashed="parameter.dashed" v-else></a-divider>
            </template>
        </template>
        <template v-if="parameter.type=='scopeGateway'">
            <x-scope-gateway :value="value" :param-path="paramPath"
                             :not-root-form="true"
                             ref="children"
                             :root="vRoot"
                             @xMessage="(val)=>{$emit('xMessage',val)}"
                             :parameter="parameter"></x-scope-gateway>
        </template>

        <template v-if="parameter.type=='modal'">
            <a-modal :visible="parameter.visible"
                     @cancel="cancelHandler"
                     @ok="okHandler"
                     :title="parameter.name">
                <x-form style="overflow: hidden" :value="value"
                        @xMessage="(val)=>{$emit('xMessage',val)}"
                        :param-path="paramPath"
                        :not-root-form="true"
                        :container-props="parameter.props"
                        ref="children"
                        :root="vRoot"
                        :parameter="parameter.list">
                </x-form>
            </a-modal>
        </template>

        <template v-if="parameter.type=='container'">
            <x-form style="overflow: hidden" :value="value"
                    @xMessage="(val)=>{$emit('xMessage',val)}"
                    :param-path="paramPath"
                    :not-root-form="true"
                    :container-props="parameter.props"
                    ref="children"
                    :root="vRoot"
                    :parameter="parameter.list">
            </x-form>
        </template>

    </div>
</template>

<script>
    import DesignerFormItem from "./DesignerFormItem";
import XRuntime from './XRuntime'
    export default {
        name: "XItem",
        components: {DesignerFormItem},
        props:["parameter",'value','paramPath','notRootForm','root','record'],
        created(){
            if(this.parameter.defaultValue&&this.value[this.parameter.key]==null){
                this.$set(this.value,this.parameter.key,this.parameter.defaultValue)
            }
        },
        data(){
            return {
                vRoot:this.root,
                dataSource:null
            }
        },
        methods:{
            recursionHandler(message){
                let children = this.$refs.children
                if(Array.isArray(children)){
                    children.forEach(function(child){
                        child.recursionHandler&&child.recursionHandler(message)
                    })
                }
                else {
                    children&&children.recursionHandler&&children.recursionHandler(message)
                }
                if(message.type&&message.type=='scopeMessage'){
                    this.scopeMessageHandler(message)
                }
            },
            scopeMessageHandler(message){
                let me = this
                if(this.parameter.scopeListeners){
                    this.parameter.scopeListeners.forEach(function(scopeListener){
                        if(scopeListener.scopeName==message.scopeName){
                            let xRuntime = new XRuntime(scopeListener.handler,me)
                            xRuntime.validate()
                            xRuntime.exec({scopeName:message.scopeName})
                        }
                    })
                }
            },
            btnClickHandler(record){
                let xRuntime = new XRuntime(this.parameter.clickHandler,this,{record:record})
                xRuntime.validate()
                xRuntime.exec()
            },
            okHandler(){
                let xRuntime = new XRuntime(this.parameter.okHandler,this)
                xRuntime.validate()
                xRuntime.exec()
            },
            cancelHandler(){
                let xRuntime = new XRuntime(this.parameter.cancelHandler,this)
                xRuntime.validate()
                xRuntime.exec()
            }
        }
    }
</script>

<style scoped>

</style>
