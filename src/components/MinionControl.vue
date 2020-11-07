<template>
    <div class="py-1 m-0 row d-flex align-items-center">
        <div class="col-2">
            <span
                v-if="actionsFile && actionsFile.name"
                class="text-monospace"
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
                @keyup.enter="updateMinions"
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
                @click="$emit('update-minions', 0)"
                type="button"
                class="btn btn-dark text-danger float-right"
            >
                Clear All
            </button>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, watch, ref } from 'vue';
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
                type: File
            }
        },

        setup ({ minions }, { emit }) {
            const minionCount = ref(minions.length);

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

            const updateMinions = function () {
                const oldCount = minions.length;
                const newCount = minionCount.value;
                const countDiff = newCount - oldCount;

                // no difference, don't do anything
                if (countDiff === 0) return;

                emit('update-minions', countDiff);
            };

            watch(minions, function () {
                minionCount.value = minions.length;
            });

            return {
                subBtns,
                addBtns,
                updateMinions,
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
        width: 3rem;
    }
</style>
