<script context="module" lang="ts">
    export const prerender = true;
</script>

<script lang="ts">
    import { page } from "$app/stores";
    import { browser } from "$app/env";
    import PageTransi from "$lib/PageTransi.svelte";

    const id = $page.params.id;
    const base_url = "https://cloudflare-ipfs.com/ipfs/bafybeiavxdez2mrt76thy4ij4eddozq6aqkme5f3sc2vcqv7766osubste/";
    let loaded = false;
    let symbol = "";
    let owned = false;
    let opensea = `https://testnets.opensea.io/assets/`;

    if (browser) {
        init();
    }

    async function init() {
        const { default: contract, config } = await import("../../contract");

        opensea = `https://testnets.opensea.io/assets/${config.ADDRESS}/${id}`;

        symbol = await contract.contract.TOKEN_SYMBOL();
        try {
            const uri = await contract.contract.tokenURI(id);
            owned = !!uri;
        } catch (e) {
            owned = false;
        }
        loaded = true;
    }
</script>

<svelte:head>
    <title>{symbol} #{id} | TOT</title>
</svelte:head>

{#if loaded}
    <PageTransi>
        <h1>{symbol} #{id}</h1>
        <img src="{base_url}{id}.svg" class="my-4 mx-auto w-1/2" alt="{symbol} #{id}" />
        <p class="text-center">
            {#if owned}
                <a href={opensea} target="_blank">This token has been claimed.</a>
            {:else}
                <span href={opensea} target="_blank">
                    This token has not been claimed! <br />
                    <a href="/">Mint it right now!</a>
                </span>
            {/if}
        </p>
    </PageTransi>
{:else}
    <PageTransi>
        <h1 class="text-center animate-pulse">Loading</h1>
    </PageTransi>
{/if}
