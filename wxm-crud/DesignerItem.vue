<template>
    <div :class="(selectedItem!==value?'item':'item-selected')+(value.inline==true?' inline':'')"
         :style="(value.inline==true?'display:inline-block;margin-left:4px;':'')
            +(value.marginTop?'margin-top:'+value.marginTop+';':'')
            +(value.marginRight?'margin-right:'+value.marginRight+';':'')
            +(value.marginBottom?'margin-bottom:'+value.marginBottom+';':'')
            +(value.marginLeft?'margin-left:'+value.marginLeft+';':'')"
         @click.stop="clickHandler">
        <!--基础字段-->
        <template v-if="value.type=='a'">
            <a href="javascript:;">{{value.name}}</a>
        </template>

        <template v-if="value.type=='button'">
                    <a-button :type="value.btnType">{{value.name}}</a-button>
        </template>

        <template v-if="value.type=='input'">
            <designer-form-item :value="value">
                <a-input :placeholder="value.placeholder"
                         :read-only="true" v-model="value.defaultValue"></a-input>
            </designer-form-item>
        </template>
        <template v-if="value.type=='datePicker'">
            <designer-form-item :value="value">
                <a-date-picker :placeholder="value.placeholder"
                               v-model="value.defaultValue"></a-date-picker>
            </designer-form-item>
        </template>

        <template v-if="value.type=='table'">
            <a-table :columns="value.cols" bordered></a-table>
            <div v-for="(slot,i) in value.slots" style="border-top: 1px dashed #aaaaaa;"
                 :key="i">
                <designer-panel
                        :container-props="slot.props"
                        :list.sync="slot.list"
                        :selected.sync="selectedItem"></designer-panel>
            </div>
        </template>


        <!--布局字段-->
        <template v-if="value.type=='grid'">
            <a-row :style="'background-color: #F9CD9E'">
                <a-col v-for="(col,i) in value.cols" :span="col.span" :key="i">
                    <div style="margin:2px 1px;
                        border:1px dashed #aaaaaa;background-color: #FFF">
                        <designer-panel
                                :container-props="col.props"
                                :selected.sync="selectedItem"
                                :list.sync="col.list"></designer-panel>
                    </div>
                </a-col>
            </a-row>
        </template>

        <template v-if="value.type=='tabs'">
            <a-tabs :default-active-key="0">
                <a-tab-pane v-for="(tab,i) in value.tabs" :tab="tab.name" :key="i">
                    <div style="margin:2px 1px;
                        border:1px dashed #aaaaaa;background-color: #FFF">
                        <designer-panel
                                :container-props="tab.props"
                                :selected.sync="selectedItem"
                                :list.sync="tab.list"></designer-panel>
                    </div>
                </a-tab-pane>
            </a-tabs>
        </template>

        <template v-if="value.type=='divider'">
            <template v-if="value.orientation=='center'">
                <a-divider :dashed="value.dashed" v-if="value.name">{{value.name}}</a-divider>
                <a-divider :dashed="value.dashed" v-else></a-divider>
            </template>
            <template v-else>
                <a-divider :orientation="value.orientation" :dashed="value.dashed" v-if="value.name">{{value.name}}</a-divider>
                <a-divider :orientation="value.orientation" :dashed="value.dashed" v-else></a-divider>
            </template>
        </template>

        <template v-if="['scopeGateway','modal','container'].indexOf(value.type)>=0">
            <div style="margin: 1px;">
                <designer-panel :selected.sync="selectedItem"
                                :container-props="value.props"
                                :list.sync="value.list"></designer-panel>
            </div>
        </template>

        <div class="component-drag" v-if="selectedItem==value" style="z-index:999">
            <i class="iconfont icon-drag"></i>
        </div>
        <div @click="()=>this.$emit('itemDel',this.value)"
             class="component-del" v-if="selectedItem==value" style="z-index:999">
            <i class="iconfont icon-trash"></i>
        </div>
    </div>
</template>

<script>
    import DesignerFormItem from "./DesignerFormItem";
    export default {
        name: "DesignerItem",
        components: {DesignerFormItem},
        props:["value",'selected','containerProps'],
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
            selectedItem(val) {
                this.$emit('update:selected', val)
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
