<script context="module" lang="ts">
    export const prerender = true;
</script>

<script lang="ts">
    import { page } from "$app/stores";
    import PageTransi from "$lib/PageTransi.svelte";

    const id = $page.params.id;
</script>

<svelte:head>
    <title>{id}</title>
</svelte:head>

<PageTransi>
    <h1>{id}</h1>
</PageTransi>
