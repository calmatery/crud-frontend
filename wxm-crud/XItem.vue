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

        <template v-if="parameter.type=='tabs'">
            <a-tabs :default-active-key="0">
                <a-tab-pane v-for="(tab,i) in parameter.tabs" :key="i" :tab="tab.name">
                    <x-from style="overflow: auto" :value="value"
                            :parameter="tab.list"></x-from>
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
