<script lang="ts" setup>
import WelcomeItem from './WelcomeItem.vue';
import DocumentationIcon from './icons/IconDocumentation.vue';
</script>

<template>
    <WelcomeItem>
        <template #icon>
            <DocumentationIcon />
        </template>
        <template #heading>Documentation</template>

        <p>No documentation yet - site still a work in progress.</p>
        <p>
            This application is continually being added to, and will eventually function with my
            <a href="https://github.com/kenzal/craps-engine">Craps Engine</a> as a backend.
        </p>
    </WelcomeItem>
</template>
