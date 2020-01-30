<template>
    <div>
        <div class="left-container" style="width: 100px">
            1231
        </div>
        <div style="margin-left: 100px">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DesignerFormItem"
    }
</script>

<style scoped>
    .left-container{
        float:left;
        text-align: right;
        padding-right: 10px;
        line-height: 40px;
    }

</style>
