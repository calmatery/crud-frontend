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

        <template v-if="parameter.type=='grid'">
            <a-row>
                <a-col v-for="(col,i) in parameter.cols" :span="col.span" :key="i">
                    <x-from style="overflow: auto" :value="value"
                            :parameter="col.list"></x-from>
                </a-col>
            </a-row>
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
            if(this.parameter.defaultValue&&this.value[this.parameter.key]==null){
                this.$set(this.value,this.parameter.key,this.parameter.defaultValue)
            }
        }
    }
</script>

<style scoped>

</style>
