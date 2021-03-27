<template>
    <div class="py-1 m-0 row d-flex align-items-center">
        <div class="col-2">
            <input
                type="file"
                style="display: none"
                ref="fileInput"
                @change="handleUpload"
            >

            <a
                type="file"
                @click="showFilePrompt"
                class="btn btn-dark float-start"
                :disabled="!(actionsFile && actionsFile.name)"
            >
                <span
                    v-if="actionsFile && actionsFile.name"
                    class="font-monospace"
                >
                    <span>
                        {{actionsFile.name ? actionsFile.name : ''}}
                    </span>

                    <span class="text-muted">
                        ({{actionsFile.size ? bytes(actionsFile.size) : '' }})
                    </span>
                </span>
                <span
                    v-if="!actionsFile || !actionsFile.name"
                    class="text-muted"
                >
                    No actions file
                </span>
            </a>
        </div>

        <div class="col d-flex justify-content-center">
            <MinionControlButton
                v-for="btn in subBtns"
                :key="btn.id"
                :button="btn"
                @update-minions="$emit('update-minions', btn.num)"
            />

            <input
                v-model.number="minionCount"
                @keyup.enter="setMinions"
                @blur="minionCount = minions.length"
                class="minion-count mx-3 px-2 bg-dark text-center text-white radius-0 border-0 border-secondary"
            >

            <MinionControlButton
                v-for="btn in addBtns"
                :key="btn.id"
                :button="btn"
                @update-minions="$emit('update-minions', btn.num)"
            />
        </div>

        <div class="col-2">
            <button
                @click="$emit('clear-all')"
                type="button"
                class="btn btn-dark text-danger float-end"
            >
                Clear All
            </button>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, watch, ref, computed } from 'vue';
    import MinionControlButton from './MinionControlButton.vue';
    import utils from '../js/utils';

    export default defineComponent({
        name: 'MinionControl',

        components: {
            MinionControlButton
        },

        props: {
            minions: {
                required: true,
                type: Object
            },

            actionsFile: {
                required: true,
                type: Object
            }
        },

        setup ({ minions }, { emit, props }) {
            const minionCount = ref(minions.length);
            const fileInput = ref(null);

            const subBtns = [
                { text: '-50', num: -50 },
                { text: '-10', num: -10 },
                { text: '-1', num: -1 }
            ];

            const addBtns = [
                { text: '+1', num: 1 },
                { text: '+10', num: 10 },
                { text: '+50', num: 50 }
            ];

            const fileUrl = computed(() => {
                const data = new Blob([props.actionsFile.content]);
                return window.URL.createObjectURL(data);
            });

            const setMinions = function () {
                const newCount = minionCount.value;

                if (newCount < 0) {
                    minionCount.value = 0;
                    return;
                }

                const oldCount = minions.length;
                const countDiff = newCount - oldCount;

                // no difference, don't do anything
                if (countDiff === 0) return;

                emit('update-minions', countDiff);
            };

            const showFilePrompt = () => {
                if (fileInput && fileInput.value) {
                    if (fileInput.value.onclick) fileInput.value.onclick();
                    else if (fileInput.value.click) fileInput.value.click();
                }
            };

            const handleUpload = () => {
                emit('handle-drop', {
                    dataTransfer: {
                        files: fileInput.value.files
                    }
                });
            };

            watch(minions, function () {
                minionCount.value = minions.length;
            });

            return {
                subBtns,
                addBtns,
                fileUrl,
                fileInput,
                setMinions,
                showFilePrompt,
                handleUpload,
                minionCount,
                bytes: utils.bytes
            };
        }
    });
</script>

<style lang="scss" scoped>
    .minion-count {
        font-size: 1.25rem;
        border-bottom: 1px solid white !important;
        outline: none;
        width: 4rem;
    }
</style>
