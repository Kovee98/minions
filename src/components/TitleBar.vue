<template>
    <nav class="navbar bg-primary">
        <div class="container-fluid">
            <span class="navbar-brand mb-0 h1">
                <img :src="logo" height="24" class="d-inline-block align-text-top me-1">
                Minions
            </span>
        </div>
    </nav>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import logo from '../assets/logo.svg';

    export default defineComponent({
        name: 'TitleBar',
        setup () {
            return {
                logo
            };
        }
    });
</script>
