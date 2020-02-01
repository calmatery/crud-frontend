<template>
    <div>
        <template v-if="parameter.type=='input'">
            <designer-form-item :value="parameter">
                <a-form-item>
                    <a-input :placeholder="parameter.placeholder"
                             v-model="value[parameter.key]"></a-input>
                </a-form-item>
            </designer-form-item>
        </template>

        <template v-if="parameter.type=='datePicker'">
            <designer-form-item :value="parameter">
                <a-form-item>
                    <a-date-picker :placeholder="parameter.placeholder"
                                   v-model="value[parameter.key]"></a-date-picker>
                </a-form-item>
            </designer-form-item>
        </template>

    </div>
</template>

<script>
    import DesignerFormItem from "./DesignerFormItem";
    export default {
        name: "XItem",
        components: {DesignerFormItem},
        props:["parameter",'value'],
        created(){
            console.log(this)
            this.parameter.defaultValue&&(this.value[this.parameter.key]=this.parameter.defaultValue)
        }
    }
</script>

<style scoped>

</style>
