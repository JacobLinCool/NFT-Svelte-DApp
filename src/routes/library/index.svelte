<script context="module" lang="ts">
    export const prerender = true;
</script>

<script lang="ts">
    import PageTransi from "$lib/PageTransi.svelte";
</script>

<svelte:head>
    <title>Library</title>
</svelte:head>

<PageTransi>
    {#each Array.from({ length: 100 }).map((_, i) => i + 1) as i}
        <div>
            <a href="/library/{i}" sveltekit:prefetch><h1>{i}</h1></a>
        </div>
    {/each}
</PageTransi>
