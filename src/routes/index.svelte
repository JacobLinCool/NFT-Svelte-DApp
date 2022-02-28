<script lang="ts">
    import type { Contract } from "dapp-contract";
    import { browser } from "$app/env";
    import Count from "$lib/Count.svelte";
    import PageTransi from "$lib/PageTransi.svelte";

    $: loaded = false;
    $: max = 1;
    $: min = 1;
    $: total_supply = 1;
    $: already_minted = 0;
    $: cost = BigInt(-1);
    $: minting = false;
    $: message = "";
    let contract: Contract;
    let count = 1;
    let connection_error = "Initializing...";
    let connected = false;

    if (browser) {
        init();
    }

    async function init() {
        const { default: c } = await import("../contract");

        contract = c;

        if (c.ethereum) {
            // @ts-ignore
            if (parseInt(c.ethereum.chainId) !== c.network) {
                connection_error = "Wrong Network. Please switch the network ID to " + c.network;
            }
            connection_error = "";
        } else {
            connection_error = "No Ethereum connection found. Please install Metamask.";
        }

        max = parseInt(await c.contract.ONCE_MINT_MAX());
        total_supply = parseInt(await c.contract.TOTAL_SUPPLY());
        already_minted = parseInt(await c.contract.totalSupply());
        cost = BigInt(await c.contract.TOKEN_COST());
        loaded = true;

        // @ts-ignore
        c.ethereum.on("chainChanged", async () => {
            // @ts-ignore
            if (parseInt(c.ethereum.chainId) !== c.network) {
                connection_error = "Wrong Network. Please switch the network ID to " + c.network;
            } else {
                connection_error = "";
            }
        });
    }

    async function mint() {
        if (contract.status) {
            minting = true;
            const c = contract.contract;
            let hash = "";
            try {
                message = `Minting.`;
                const tx = await c.mint(count, { value: cost * BigInt(count) });
                hash = tx.hash;
                message = `Confirming... <br /><a href="https://rinkeby.etherscan.io/tx/${hash}" target="_blank">Transaction: ${hash}</a>`;
                const minted = await tx.wait();
                const tokens: number[] = minted.events.map((evt) => parseInt(evt.args.tokenId._hex));
                message = `Minted ${tokens.length} TOT${tokens.length > 1 ? "s" : ""}: ${tokens
                    .map((token) => `<a href="/library/${token}" target="_blank">#${token}</a>`)
                    .join(", ")}`;
            } catch (err) {
                console.log(err);
                message = `<span class="text-red-500">Error: Transaction Failed. <br />See <a href="https://rinkeby.etherscan.io/tx/${hash}" target="_blank">${hash}</a></span>`;
            } finally {
                minting = false;
            }
        } else {
            await contract.connect();
            connected = true;
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
            {loaded ? (contract.status || connected ? (minting ? "Minting" : "Mint") : "Enable") : "Loading"}
        </button>

        {#if connection_error}
            <p class="m-4 text-center text-red-500">{connection_error}</p>
        {:else}
            <p class="m-4 text-green-500 text-center {minting ? 'animate-pulse' : ''}">
                {#if message}
                    {@html message}
                {:else}
                    Mint {count} of {total_supply - already_minted} wild TOT{total_supply - already_minted > 1
                        ? "s"
                        : ""}!
                {/if}
            </p>
        {/if}
    </section>
</PageTransi>
