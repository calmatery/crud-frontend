<template>
    <div :class="selectedItem!==self?'item':'item-selected'" @click="clickHandler">
        <template v-if="value.type=='input'">
            <designer-form-item>
                <a-form-item>
                    <a-input></a-input>
                </a-form-item>
            </designer-form-item>
            <div class="component-drag" v-if="selectedItem==self">
                <i class="iconfont icon-drag"></i>
            </div>
        </template>
    </div>
</template>

<script>
    import AFormItem from "ant-design-vue/es/form/FormItem";
    import DesignerFormItem from "./DesignerFormItem";
    export default {
        name: "IDesignerItem",
        components: {DesignerFormItem, AFormItem},
        props:["value",'selected'],
        data(){
            return{
                selectedItem : this.selected,
                self : this
            }
        },
        methods:{
            clickHandler(){
                this.selectedItem = this;
                console.log(this)
                console.log(123123)
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
    .component-drag{
        position: absolute;
        left: -1px;
        top: -1px;
        background-color: #1890FF;
        color: #FFF;
        width: 24px;
        text-align: center;
    }
    .item, .item-selected{
        position: relative;
        overflow: hidden;
        margin-top: 4px
    }
    .item:hover{
        outline:2px solid #1890FF;
    }
    .item{
        border:1px dashed #aaaaaa;
    }
    .item-selected{
        outline:2px solid #1890FF;
        border:1px dashed #1890FF;
    }

</style>
