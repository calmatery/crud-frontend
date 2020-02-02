<template>
    <div>
        <a-form>
            <x-item v-for="item in (Array.isArray(parameter)?parameter:parameter.list)" :key="item.key"
                    :value="value" :parameter="item"></x-item>
        </a-form>
    </div>
</template>

<script>
    export default {
        name: "XFrom",
        props:["parameter",'value'],
        data(){
            return {
            }
        }
    }
</script>

<style scoped>

</style>
