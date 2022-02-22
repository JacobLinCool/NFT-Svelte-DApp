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
    <title>About | TOT</title>
</svelte:head>

<PageTransi>
    <div class="mx-auto mt-12 w-full max-w-2xl text-center">
        <h1 class="mb-4">About</h1>

        <p class="leading-8">This is a Svelte Based NFT Web DApp.</p>
        <br />

        <p class="leading-8">
            You can find the details in the GitHub Repository of this site. <br />
            Tech Stack: Ethers.js, SvelteKit, Svelte, TailwindCSS, TypeScript.
        </p>

        <p class="leading-8">
            The example NFT is <a href="https://github.com/JacobLinCool/TOT" target="_blank">TOT (Test Only Token)</a>,
            you can find the details and steps to generate TOT-like NFT
            <a href="https://github.com/JacobLinCool/TOT#readme" target="_blank">here</a>.
        </p>
    </div>
</PageTransi>
