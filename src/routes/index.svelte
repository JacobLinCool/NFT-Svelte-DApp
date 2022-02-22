<script context="module" lang="ts">
    import { browser } from "$app/env";
    import { init, enable, set_update, get } from "../contract";

    async function initialize() {
        if (browser) {
            await init();
        }
    }
</script>

<script lang="ts">
    import Count from "$lib/Count.svelte";
    import PageTransi from "$lib/PageTransi.svelte";

    $: loaded = false;
    $: max = 1;
    $: min = 1;
    $: total_supply = 1;
    $: already_minted = 0;
    $: cost = BigInt(-1);
    $: connection = get.connection();
    $: minting = false;
    $: message = "";
    let count = 1;
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

    async function update() {
        max = parseInt(await get.readonly_contract().ONCE_MINT_MAX());
        total_supply = parseInt(await get.readonly_contract().TOTAL_SUPPLY());
        already_minted = parseInt(await get.readonly_contract().totalSupply());
        cost = BigInt(await get.readonly_contract().TOKEN_COST());
        loaded = true;
    }

    async function mint() {
        if (connection.enabled) {
            minting = true;
            const contract = get.contract();
            try {
                message = `Minting.`;
                const tx = await contract.mint(count, { value: cost * BigInt(count) });
                message = `Confirming... <a href="https://rinkeby.etherscan.io/tx/${tx.hash}" target="_blank">Transaction: ${tx.hash}</a>`;
                const minted = await tx.wait();
                const tokens: number[] = minted.events.map((evt) => parseInt(evt.args.tokenId._hex));
                message = `Minted ${tokens.length} TOT${tokens.length > 1 ? "s" : ""}: ${tokens
                    .map((token) => `<a href="/library/${token}" target="_blank">#${token}</a>`)
                    .join(", ")}`;
            } catch (err) {
                console.log(err);
                message = `<span class="text-red-500">Error: ${err.message}</span>`;
            } finally {
                minting = false;
            }
        } else {
            await enable();
        }
    }
</script>

<svelte:head>
    <title>Home | TOT</title>
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
            disabled={!loaded || minting}
        >
            {loaded ? (connection.enabled ? (minting ? "Minting" : "Mint") : "Enable") : "Loading"}
        </button>

        {#if connection.error}
            <p class="m-4 text-center text-red-500">{connection.error}</p>
        {:else}
            <p class="m-4 text-green-500 text-center {minting ? 'animate-pulse' : ''}">
                {#if message}
                    {@html message}
                {:else}
                    Find {count} of {total_supply - already_minted} missing TOT{total_supply - already_minted > 1
                        ? "s"
                        : ""}!
                {/if}
            </p>
        {/if}
    </section>
</PageTransi>
