<script context="module" lang="ts">
    export const prerender = true;
</script>

<script lang="ts">
    import { browser } from "$app/env";
    import Count from "$lib/Count.svelte";
    import PageTransi from "$lib/PageTransi.svelte";
    import { init, enable, set_update, get } from "../contract";

    $: loaded = false;
    $: max = 1;
    $: min = 1;
    $: total_supply = 1;
    $: cost = BigInt(-1);
    let count = 1;
    $: connection = get.connection();
    if (!get.readonly_contract()) {
        set_update(async (c) => {
            connection = c;
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
        max = parseInt(await get.readonly_contract().ONCE_MINT_MAX());
        total_supply = parseInt(await get.readonly_contract().TOTAL_SUPPLY());
        cost = BigInt(await get.readonly_contract().TOKEN_COST());
        loaded = true;
        console.log(connection, get);
    }

    async function mint() {
        if (connection.enabled) {
            const contract = get.contract();
            await contract.mint(count, { value: cost * BigInt(count) });
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

            Mint your<br />TOT{count > 1 ? "s" : ""}
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

        {#if loaded}
            <p class="font-bold">Cost: {Number((cost * BigInt(count)) / BigInt(1e12)) / 1e6} Ether</p>
        {:else}
            <p class=" animate-pulse">Loading Cost...</p>
        {/if}

        <button
            on:click={mint}
            class="h-16 w-36 rounded-lg border border-indigo-600 text-xl text-indigo-600 transition-all hover:text-4xl hover:shadow-lg disabled:opacity-50 disabled:grayscale-[0.5]"
            disabled={!loaded}
        >
            {loaded ? (connection.enabled ? "Mint" : "Enable") : "Loading"}
        </button>

        {#if connection.error}
            <p class="m-4 text-center text-red-500">{connection.error}</p>
        {:else}
            <p class="m-4 text-green-500 text-center">
                Meet {count} of {total_supply} TOT{count > 1 ? "s" : ""} in the world!
            </p>
        {/if}
    </section>
</PageTransi>
