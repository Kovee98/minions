<template>
    <div class="minion shadow card m-3 bg-dark border-0">
        <div class="card-header font-weight-bold">
            #{{minion.id}}
        </div>
        <div class="card-body text-monospace text-truncate d-flex justify-content-center align-items-center">
            <p :class="`text-capitalize ${isError ? 'text-danger' : ''}`">{{status}}</p>
        </div>
    </div>
</template>

<script lang="ts">
    /* eslint-disable vue/no-mutating-props */
    import { defineComponent, watch, ref } from 'vue';
    import bus from '../js/bus';

    export default defineComponent({
        name: 'MinionAgent',

        props: {
            minion: {
                required: true,
                type: Object
            }
        },

        setup ({ minion }) {
            const status = ref('untrained');
            const isError = ref(false);

            const handleMessage = function (e: MessageEvent) {
                const data = e.data;
                isError.value = false;

                switch (data.type) {
                    case 'status':
                        status.value = data.status;
                        break;
                    case 'err':
                        status.value = data.msg;
                        isError.value = true;
                        break;
                    case 'result':
                        // set back to 'ready' state if nothing returned
                        status.value = data.result || 'ready';
                        break;
                    default:
                        console.log(e.data);
                        status.value = 'ready';
                        break;
                }
            };

            const initWorker = function () {
                if (!minion || !minion.worker) return;

                minion.worker.onmessage = handleMessage;

                // test to see if worker is alive
                minion.worker.postMessage({ cmd: 'ping' });
            };

            // re-init worker when minion changes
            watch(minion, initWorker);

            // pass command to worker
            bus.on('*', function (cmd: string, args: Array<string>) {
                if (!minion || !cmd) return;

                minion.worker?.postMessage({ cmd, args });
            });

            // init worker on initial creation
            initWorker();

            return {
                status,
                isError
            };
        }
    });
</script>

<style lang="scss" scoped>
    .minion {
        width: 10rem;
        height: 10rem;
    }

    .toast {
        opacity: 1 !important;
    }
</style>
