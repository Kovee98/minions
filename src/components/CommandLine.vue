<template>
    <div>
        <div class="w-100"></div>
        <div class="cmd-line d-flex align-items-center bg-dark">
            <i class="icon-right-open mx-2 ml-3"></i>

            <input
                v-model.trim="cmd"
                @keyup.enter="executeCmd"
                class="w-100 py-3 border-0 rounded-0 bg-dark text-white text-monospace font-weight-bold"
                :placeholder="placeholder"
            >
        </div>
    </div>
    <!-- <div class="cmd-line d-flex align-items-center bg-dark">
        <i class="icon-right-open mx-2 ml-3"></i>

        <input
            v-model.trim="cmd"
            @keyup.enter="executeCmd"
            class="w-100 py-3 border-0 rounded-0 bg-dark text-white text-monospace font-weight-bold"
            :placeholder="placeholder"
        >
    </div> -->
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue';
    import utils from '../js/utils';

    export default defineComponent({
        name: 'CommandLine',

        props: {
            placeholder: {
                required: true,
                type: String
            }
        },

        setup (_, { emit }) {
            const cmd = ref('');

            const executeCmd = function () {
                if (!cmd.value) return;

                const baseCmd = cmd.value;
                const args = baseCmd.split(' ');
                const command = args.shift();

                emit('execute-cmd', utils.camelizeStr(command as string), args);
            };

            return {
                cmd,
                executeCmd
            };
        }
    });
</script>

<style lang="scss" scoped>
    .cmd-line {
        // border-top: 1px solid white;

        > i {
            font-size: 1.35rem;
        }

        > input {
            font-size: 1.4rem;
            outline: none
        }
    }
</style>
