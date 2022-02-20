<script context="module" lang="ts">
    export const prerender = true;
</script>

<script lang="ts">
    import { browser } from "$app/env";
    import Count from "$lib/Count.svelte";
    import PageTransi from "$lib/PageTransi.svelte";
    import { init, enable, set_update, get } from "../contract";

    $: max = 1;
    $: min = 1;
    $: max_supply = 1;
    let count = 1;
    $: connection = get.connection();
    set_update((c) => {
        connection = c;
    });

    initialize();

    async function initialize() {
        if (browser) {
            await init();
            max = parseInt(await get.readonly_contract().maxMintAmount());
            max_supply = parseInt(await get.readonly_contract().maxSupply());
        }
    }

    async function mint() {
        if (connection.enabled) {
            const contract = get.contract();
            await contract.mint(count);
        } else {
            await enable();
        }
    }
</script>

<svelte:head>
    <title>Home</title>
</svelte:head>

<PageTransi>
    <section class="flex flex-1 flex-col items-center justify-center">
        <h1 class="w-full">
            <div class="h-0 w-full pb-[calc(100%*495/2048)]">
                <img src="welcome.png" class="absolute block h-full w-full hue-rotate-[250deg]" alt="Welcome" />
            </div>

            Mint your<br />Desire Monster{count > 1 ? "s" : ""}
        </h1>

        <h2>
            Minimun: <strong>{min}</strong>, Maximun: <strong>{max}</strong>
        </h2>

        <Count
            on:changed={(e) => {
                count = e.detail.count;
            }}
            bind:max
            bind:min
        />

        <button
            on:click={mint}
            class="h-16 w-36 rounded-lg border border-indigo-600 text-xl text-indigo-600 transition-all hover:text-4xl hover:shadow-lg"
        >
            {connection.enabled ? "Mint" : "Enable"}
        </button>

        {#if connection.error}
            <p class="m-4 text-center text-red-500">{connection.error}</p>
        {:else}
            <p class="m-4 text-green-500 text-center">
                Meet {count} of {max_supply} Desires Monster{count > 1 ? "s" : ""} in the world!
            </p>
        {/if}
    </section>
</PageTransi>
