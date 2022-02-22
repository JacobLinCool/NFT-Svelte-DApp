<script context="module" lang="ts">
    export const prerender = true;
</script>

<script lang="ts">
    import { page } from "$app/stores";
    import { browser } from "$app/env";
    import PageTransi from "$lib/PageTransi.svelte";
    import { config, init, set_update, get } from "../../contract";

    const id = $page.params.id;

    const base_url = "https://cloudflare-ipfs.com/ipfs/bafybeiavxdez2mrt76thy4ij4eddozq6aqkme5f3sc2vcqv7766osubste/";
    $: loaded = false;
    $: symbol = "";
    $: owned = false;
    $: opensea = `https://testnets.opensea.io/assets/${config.ADDRESS}/${id}`;
    if (!get.readonly_contract()) {
        set_update(async () => {
            if (get.readonly_contract()) {
                update();
            }
        });
        initialize();
    } else {
        update();
    }

    async function initialize() {
        if (browser) {
            await init();
        }
    }

    async function update() {
        symbol = await get.readonly_contract().TOKEN_SYMBOL();
        try {
            const uri = await get.readonly_contract().tokenURI(id);
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
