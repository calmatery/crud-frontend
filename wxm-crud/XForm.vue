<template>
    <div :style="containerProps&&containerProps.textAlign?('text-align:'+containerProps.textAlign+';'):''">
        <x-item @xMessage="xMessageHandler"
                :not-root-form="true"
                ref="children"
                :record="record"
                :root="vRoot"
                v-for="item in (Array.isArray(parameter)?parameter:parameter.list)" :key="item.key"
                :value="value" :parameter="item" :param-path="paramPath"></x-item>
    </div>
</template>

<script>
    import XRuntime from "./XRuntime";
    export default {
        name: "XForm",
        props:["parameter",'value','paramPath'
            ,'notRootForm','root','containerProps'
            ,'record'],
        created(){
            if(!this.notRootForm){
                this.$set(this,'vRoot',this)
                this.xRuntime = new XRuntime(this)
            }
        },
        data(){
            return {
                vRoot:this.root,
                xRuntime:null
            }
        },
        methods:{
            xMessageHandler(message){
                if(!this.notRootForm){
                    this.recursionHandler(message)
                }
                this.$emit('xMessage',message)
            },
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
            }
        }
    }
</script>

<style scoped>

</style>
