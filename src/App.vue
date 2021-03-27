<template>
    <div class="h-100 d-flex flex-column bg-dark text-white">
        <TitleBar />

        <div
            @drop.prevent="handleDrop"
            @dragleave="isDragging = false"
            @dragenter.prevent
            @dragover.prevent
            :class="`drop-area ${isDragging ? '' : 'invisible'}`"
        />

        <MinionControl
            :minions="minions"
            :actionsFile="actionsFile"
            @update-minions="updateMinions"
            @clear-all="clearAll"
            @handle-drop="handleDrop"
        />

        <div :class="`minion-list overflow-auto h-100 p-5 ${isDragging ? 'text-primary' : ''}`">
            <div
                v-if="minions?.length > 0"
                class="d-flex flex-wrap justify-content-center"
            >
                <MinionAgent
                    v-for="(minion, i) in minions"
                    :key="minion.id"
                    :minion="minions[i]"
                />
            </div>

            <div
                v-if="minions?.length <= 0"
                class="d-flex flex-column align-items-center"
            >
                <div class="shadow card m-3 bg-dark border-0">
                    <div class="card-header p-4">
                        <h3 class="m-0">Get Started</h3>
                    </div>
                    <div class="card-body p-4 text-truncate d-flex justify-content-center align-items-center">
                        <ol>
                            <li>Add minions with the controls above</li>
                            <li>Train minions by dragging and dropping an actions file on the page</li>
                            <li>Command minions with the command line below</li>
                            <li>Have fun!</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>

        <CommandLine
            @execute-cmd="executeCmd"
            :placeholder="placeholder"
        />
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, reactive, ref, onBeforeMount } from 'vue';
    import TitleBar from './components/TitleBar.vue';
    import MinionAgent from './components/MinionAgent.vue';
    import MinionControl from './components/MinionControl.vue';
    import CommandLine from './components/CommandLine.vue';
    import { Minion } from './types';
    import bus from './js/bus';
    import baseWorkerStr from './js/worker';
    import utils from './js/utils';
    import { generalStore } from './stores/GeneralStore';

    export default defineComponent({
        name: 'App',

        components: {
            TitleBar,
            MinionAgent,
            MinionControl,
            CommandLine
        },

        setup () {
            const isDragging = ref(false);
            let actions = reactive({});
            let workerBlob: Blob|null;

            onBeforeMount(async () => await generalStore.init().then(() => {
                if (generalStore.actionsFile.content) {
                    const workerStr = generalStore.actionsFile.content + baseWorkerStr;
                    workerBlob = new Blob([workerStr], { type: 'application/javascript' });
                }

                for (let i = 0; i < generalStore.count; i++) {
                    minions?.push({
                        id: i,
                        worker: workerBlob ? new Worker(URL.createObjectURL(workerBlob)) : null
                    });
                }
            }));

            const minions: Array<Minion> = reactive([]);

            const placeholder = computed(() => {
                if (generalStore.count <= 0) {
                    return 'Add some minions to get started...';
                } else if (generalStore.count > 0 && !workerBlob) {
                    return 'Drag and drop a file to train your minions...';
                } else {
                    return 'Command your minions...';
                }
            });

            const actionsFile = computed(() => generalStore.actionsFile);

            const executeCmd = function (cmd: string, args: Array<string>) {
                bus.emit(cmd, args);
            };

            // dynamically add OR remove 'num' minions
            const updateMinions = function (num = 1) {
                if (num < 0) {
                    // remove 'num' minions
                    for (let i = 0; i < Math.abs(num); i++) {
                        const minion = minions?.pop();
                        minion?.worker?.terminate();

                        if (generalStore.count > 0) generalStore.count--;
                    }
                } else {
                    // add 'num' minions
                    for (let i = 0; i < num; i++) {
                        minions?.push({
                            id: generalStore.count,
                            worker: workerBlob ? new Worker(URL.createObjectURL(workerBlob)) : null
                        });

                        generalStore.count++;
                    }
                }
            };

            const handleDrop = function (e: DragEvent) {
                isDragging.value = false;

                if (!e.dataTransfer) return;

                const reader = new FileReader();
                const file = e.dataTransfer.files[0];

                generalStore.actionsFile.name = file.name;
                generalStore.actionsFile.size = file.size;

                reader.onload = function () {
                    let actionsStr = reader.result as string || '';

                    // remove leading variable declaration
                    actionsStr = actionsStr.replace(/(^const |^let |^var )/g, '');

                    actions = eval(actionsStr);
                    actions = utils.camelizeActions(actions);

                    actionsStr = `const ${actionsStr}`;
                    generalStore.actionsFile.content = actionsStr;

                    const workerStr = actionsStr + baseWorkerStr;
                    workerBlob = new Blob([workerStr], { type: 'application/javascript' });

                    // update all pre-existing minions with the new worker
                    for (let i = 0; i < minions.length; i++) {
                        const minion = minions[i];
                        minion?.worker?.terminate();
                        minion.worker = new Worker(URL.createObjectURL(workerBlob));
                    }
                };

                reader.readAsText(file);
            };

            const clearAll = () => {
                updateMinions(-minions.length);
                generalStore.clearActions();
                workerBlob = null;
            };

            window.addEventListener('dragenter', function () {
                isDragging.value = true;
            });

            return {
                isDragging,
                actions,
                actionsFile,
                placeholder,
                minions,
                updateMinions,
                clearAll,
                executeCmd,
                handleDrop
            };
        }
    });
</script>

<style lang="scss" scoped>
    .drop-area {
        position: fixed;
        top: 0rem;
        bottom: 0rem;
        left: 0rem;
        right: 0rem;
        z-index: 1100;

        & > div {
            position: fixed;
            border: 0.5rem dashed grey;
            pointer-events: none;
            top: 1rem;
            bottom: 1rem;
            left: 1rem;
            right: 1rem;
        }
    }
</style>
