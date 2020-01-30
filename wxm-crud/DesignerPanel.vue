<template>
    <div class="designerPanel">
        <a-form>
            <draggable :style="'height:500px'" group="designer" handle=".component-drag"
                       ghostClass="dragging"
                   v-model="itemList" @add="itemAdd">
                <i-designer-item v-for="item in itemList" :key="item.key"
                                 :value="item" :selected.sync="selected"></i-designer-item>
            </draggable>
        </a-form>
    </div>
</template>

<script>
    import IDesignerItem from "./IDesignerItem";
    export default {
        name: "DesignerPanel",
        components: {IDesignerItem},
        props: ["list"],
        created() {
        },
        data() {
            return {
                itemList: this.list,
                selected: null
            }
        },
        methods: {
            itemAdd(evt) {
                console.log(111111122)
                console.log(this)
                console.log(evt)
            }
        },
        watch: {
            itemList: {
                handler(val) {
                    this.$emit('update:list', val)
                },
                deep: true
            },
            list(val) {
                this.itemList = val
            }
        }
    }
</script>

<style>
    .wxm-crud-designer .designerPanel{
        padding: 0px 4px;
    }
    .wxm-crud-designer .designerPanel .component-icon,
    .wxm-crud-designer .designerPanel .dragging,
    .wxm-crud-designer .designerPanel .component-icon:hover {
        border: 2px solid red;
        width: 100%;
        height: 0;
        margin: 0;
        outline: none;
        overflow: hidden;
    }
    .wxm-crud-designer .designerPanel .dragging{
        float: left;
    }
</style>
