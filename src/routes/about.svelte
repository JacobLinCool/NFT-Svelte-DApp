<script context="module" lang="ts">
    import { browser, dev } from "$app/env";
    export const hydrate = dev;
    export const router = browser;
    export const prerender = true;
</script>

<script lang="ts">
    import PageTransi from "$lib/PageTransi.svelte";
</script>

<svelte:head>
    <title>About</title>
</svelte:head>

<PageTransi>
    <div class="mx-auto mt-12 w-full max-w-2xl text-center">
        <h1 class="mb-4">About Us</h1>

        <p class="leading-8">We are good people from NTNU!</p>
        <br />

        <p class="leading-8">
            We are a group of students from NTNU who are interested in blockchain and NFT. <br />
            Started in 2022, we begins some experiments with NFT and blockchain. <br />
        </p>
    </div>
</PageTransi>
