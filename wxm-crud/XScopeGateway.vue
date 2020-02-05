<template>
    <div class="scope-gateway">
        <x-form v-if="value" style="overflow: hidden" @xMessage="xMessageHandler"
                :param-path="(paramPath?paramPath+'.':'')+parameter.key"
                :value="value[parameter.key]"
                :not-root-form="true"
                ref="children"
                :parameter="parameter.list"></x-form>
    </div>
</template>

<script>
    export default {
        name: "XScopeGateway",
        props:['value','parameter','paramPath','notRootForm'],
        created(){
            this.$set(this.value,this.parameter.key,{})
        },
        data(){
            return {
            }
        },
        methods:{
            xMessageHandler(message){
                if(message.type=='triggerScope'){
                    let scopeMessage={...message}
                    scopeMessage.type='scope'
                    this.$emit('xMessage',scopeMessage)
                }
                else {
                    this.$emit('xMessage',message)
                }
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
