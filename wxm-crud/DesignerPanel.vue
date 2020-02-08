<template>
    <div class="designerPanel">
        <draggable :style="'min-height:30px;'
                   + (containerProps&&containerProps.textAlign?('text-align:'+containerProps.textAlign+';'):'')"
                   group="designer" handle=".component-drag"
                   ghostClass="dragging"
               v-model="itemList" @add="itemAdd">
            <designer-item @itemDel="itemDel"
                           :container-props="containerProps"
                           v-for="item in itemList" :key="item.key"
                             :value="item" :selected.sync="selectedItem"></designer-item>
        </draggable>
    </div>
</template>

<script>
    export default {
        name: "DesignerPanel",
        props: ["list",'selected','containerProps'],
        created() {
            // this.selectedItem = this.selected;
        },
        data() {
            return {
                selectedItem : this.selected,
                itemList: this.list,
                form:this.$form.createForm(this, { name: 'dynamic_rule' }),
            }
        },
        methods: {
            itemAdd(evt) {
                let itemValue = {...this.itemList[evt.newIndex]}
                if(itemValue.type=='grid'||itemValue.type=='table'){
                    let cols =[]
                    itemValue.cols.forEach(function(col){
                        cols.push({...col})
                    })
                    itemValue.cols = cols
                }
                if(itemValue.type=='tabs'){
                    let tabs =[]
                    itemValue.tabs.forEach(function(tab){
                        tabs.push({...tab})
                    })
                    itemValue.tabs = tabs
                }

                if(itemValue.type=='table'){
                    let scopeListeners =[]
                    itemValue.scopeListeners.forEach(function(scopeListener){
                        scopeListeners.push({...scopeListener})
                    })
                    itemValue.scopeListeners = scopeListeners
                    itemValue.slots = []
                }

                Object.keys(itemValue).map((key)=>{
                    if(key.substr(0,1)=="_"){
                        delete itemValue[key]
                    }
                })
                itemValue.key = itemValue.key||(itemValue.type+"_"+new Date().getTime()+"_"+Math.ceil(Math.random() * 99999))
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
                this.$emit('update:selected', val)
            },
            selected(val){
                this.selectedItem=val
            }
        }
    }
</script>

<style>
    .wxm-crud-designer .designerPanel{
        padding: 0px 4px 6px 4px;
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

    .wxm-crud-designer .designerPanel .component-icon.inline,
    .wxm-crud-designer .designerPanel .dragging.inline,
    .wxm-crud-designer .designerPanel .component-icon.inline:hover {
        border: 2px solid red;
        width: 0;
        height: 100%;
        margin: 0;
        outline: none;
        overflow: hidden;
    }


</style>
