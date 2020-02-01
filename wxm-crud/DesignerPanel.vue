<template>
    <div class="designerPanel">
        <a-form :form="form" @submit="testHandler">
            <draggable :style="'height:500px'" group="designer" handle=".component-drag"
                       ghostClass="dragging"
                   v-model="itemList" @add="itemAdd">
                <designer-item @itemDel="itemDel" v-for="item in itemList" :key="item.key"
                                 :value="item" :selected.sync="selectedItem"></designer-item>
            </draggable>
        </a-form>
    </div>
</template>

<script>
    import DesignerItem from "./DesignerItem";
    export default {
        name: "DesignerPanel",
        components: {DesignerItem},
        props: ["list"],
        created() {
        },
        data() {
            return {
                itemList: this.list,
                selectedItem: null,
                form:this.$form.createForm(this, { name: 'dynamic_rule' }),
            }
        },
        methods: {
            itemAdd(evt) {
                let itemValue = {...this.itemList[evt.newIndex]}
                Object.keys(itemValue).map((key)=>{
                    if(key.substr(0,1)=="_"){
                        delete itemValue[key]
                    }
                })
                itemValue.key = itemValue.type+"_"+new Date().getTime()+"_"+Math.ceil(Math.random() * 99999)
                this.$set(this.itemList,evt.newIndex,itemValue)
            },
            itemDel(item){
                let idx = this.itemList.indexOf(item);
                if(idx>=0){
                    this.itemList.splice(idx,1)
                    if(this.itemList.length>0){
                        this.selectedItem=this.itemList[idx==0?0:idx-1]
                    }
                    else {
                        this.selectedItem = null
                    }
                }
            },
            testHandler(e){
                e.preventDefault();
                this.form.validateFields((err,fieldsValue)=>{
                    if (err) {
                        return
                    }
                    console.log(fieldsValue)
                })
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
            },
            selectedItem(val) {
                this.$emit('selectedItemChange', val)
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
