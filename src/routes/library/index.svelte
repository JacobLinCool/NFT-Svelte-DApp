<script lang="ts">
    import { browser } from "$app/env";
    import PageTransi from "$lib/PageTransi.svelte";
    import { init, set_update, get } from "../../contract";

    const base_url = "https://cloudflare-ipfs.com/ipfs/bafybeiavxdez2mrt76thy4ij4eddozq6aqkme5f3sc2vcqv7766osubste/";
    $: loaded = false;
    $: symbol = "";
    $: total = 0;
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
        total = parseInt(await get.readonly_contract().TOTAL_SUPPLY());
        loaded = true;
    }
</script>

<svelte:head>
    <title>Library</title>
</svelte:head>

{#if loaded}
    <PageTransi class="h-full">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {#each Array.from({ length: total }).map((_, i) => i + 1) as i}
                <div>
                    <a href="/library/{i}" sveltekit:prefetch>
                        <h1>{symbol} #{i}</h1>
                        <img
                            src="{base_url}{i}.svg"
                            alt="{symbol} #{i}"
                            class="mx-auto w-4/5 transition-all hover:scale-95 hover:shadow-lg active:scale-90"
                            loading="lazy"
                        />
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
