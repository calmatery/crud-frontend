<template>
    <div>
        <a-form>
            <x-item v-for="item in parameter.list" :key="item.key"
                    :value="value" :parameter="item"></x-item>
        </a-form>
    </div>
</template>

<script>
    import XItem from "./XItem";
    export default {
        name: "XFrom",
        components: {XItem},
        props:["parameter",'value'],
        created(){
            console.log(this)
        },
        data(){
            return {
            }
        }
    }
</script>

<style scoped>

</style>
