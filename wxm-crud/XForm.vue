<template>
    <div>
        <x-item @xMessage="xMessageHandler"
                :not-root-form="true"
                ref="children"
                :root="vRoot"
                v-for="item in (Array.isArray(parameter)?parameter:parameter.list)" :key="item.key"
                :value="value" :parameter="item" :param-path="paramPath"></x-item>
    </div>
</template>

<script>
    export default {
        name: "XForm",
        props:["parameter",'value','paramPath','notRootForm','root'],
        created(){
            if(!this.notRootForm){
                this.$set(this,'vRoot',this)
            }
        },
        data(){
            return {
                vRoot:this.root
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
