<template>
    <div>
        <div class="left-container" style="width: 100px">
            {{value.name}}
        </div>
        <div style="margin-left: 100px">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DesignerFormItem",
        props:['value']
    }
</script>

<style scoped>
    .left-container{
        float:left;
        text-align: right;
        padding-right: 10px;
        line-height: 32px;
    }

</style>
