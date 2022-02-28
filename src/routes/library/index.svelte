<script lang="ts">
    import { browser } from "$app/env";
    import PageTransi from "$lib/PageTransi.svelte";

    const base_url = "https://cloudflare-ipfs.com/ipfs/bafybeiavxdez2mrt76thy4ij4eddozq6aqkme5f3sc2vcqv7766osubste/";
    $: loaded = true;
    $: safed = false;
    $: symbol = "";
    $: total = 3000;

    if (browser) {
        init();
    }

    async function init() {
        const { default: contract } = await import("../../contract");
        symbol = await contract.contract.TOKEN_SYMBOL();
        total = parseInt(await contract.contract.TOTAL_SUPPLY());
        loaded = true;
        safed = true;
    }

    setTimeout(() => (loaded = false), 50);
</script>

<svelte:head>
    <title>Library | TOT</title>
</svelte:head>

{#if loaded}
    <PageTransi class="h-full">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {#each Array.from({ length: total }).map((_, i) => i + 1) as i}
                <div>
                    <a href="/library/{i}" sveltekit:prefetch>
                        {#if safed}
                            <h1>{symbol} #{i}</h1>
                            <img
                                src="{base_url}{i}.svg"
                                alt="{symbol} #{i}"
                                class="mx-auto w-4/5 transition-all hover:scale-95 hover:shadow-lg active:scale-90"
                                loading="lazy"
                            />
                        {/if}
                    </a>
                </div>
            {/each}
        </div>
    </PageTransi>
{:else}
    <PageTransi>
        <div class="text-center">
            <h1 class="text-2xl animate-pulse">Loading</h1>
        </div>
    </PageTransi>
{/if}
