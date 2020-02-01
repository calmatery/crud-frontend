<template>
    <div :class="selectedItem!==value?'item':'item-selected'" @click="clickHandler">
        <template v-if="value.type=='input'">
            <designer-form-item :value="value">
                <a-form-item>
                    <a-input :placeholder="value.placeholder"
                             :read-only="true" v-model="value.defaultValue"></a-input>
                </a-form-item>
            </designer-form-item>
        </template>
        <template v-if="value.type=='datePicker'">
            <designer-form-item :value="value">
                <a-form-item>
                    <a-date-picker :placeholder="value.placeholder"
                                   v-model="value.defaultValue"></a-date-picker>
                </a-form-item>
            </designer-form-item>
        </template>
        <div class="component-drag" v-if="selectedItem==value">
            <i class="iconfont icon-drag"></i>
        </div>
        <div @click="()=>this.$emit('itemDel',this.value)" class="component-del" v-if="selectedItem==value">
            <i class="iconfont icon-trash"></i>
        </div>
    </div>
</template>

<script>
    import AFormItem from "ant-design-vue/es/form/FormItem";
    import DesignerFormItem from "./DesignerFormItem";
    export default {
        name: "DesignerItem",
        components: {DesignerFormItem, AFormItem},
        props:["value",'selected'],
        data(){
            return{
                selectedItem : this.selected,
                self : this,
                key: this.value.key
            }
        },
        methods:{
            clickHandler(){
                this.selectedItem = this.value;
            }
        },
        watch:{
            selectedItem: {
                handler(val) {
                    this.$emit('update:selected', val)
                }
            },
            selected(val) {
                this.selectedItem = val
            }
        }
    }
</script>

<style scoped>
    .component-del{
        position: absolute;
        background-color: #1890FF;
        color: #FFF;
        width: 24px;
        text-align: center;
        right: 0px;
        bottom: 0px;
        cursor: pointer;
    }

    .component-drag{
        position: absolute;
        left: -1px;
        top: -1px;
        background-color: #1890FF;
        color: #FFF;
        width: 24px;
        text-align: center;
        cursor: move;
    }
    .item, .item-selected{
        position: relative;
        overflow: hidden;
        margin-top: 4px
    }
    .item:hover{
        border:1px solid #1890FF;
    }
    .item{
        border:1px dashed #aaaaaa;
    }
    .item-selected{
        outline:2px solid #1890FF;
        border:1px solid #1890FF;
    }

</style>
