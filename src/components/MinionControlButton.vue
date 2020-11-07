<template>
    <button
        @click="$emit('update-minions', button.num)"
        type="button"
        class="btn btn-dark"
    >
        {{button.text}}
    </button>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: 'MinionControlButton',

        props: {
            button: {
                required: true,
                type: Object
            }
        }
    });
</script>
