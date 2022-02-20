<script lang="ts">
    import Header from "$lib/header/Header.svelte";
    import "../app.css";
</script>

<Header />

<main
    class="my-0 mx-auto mt-12 mb-16 box-border flex max-h-[calc(100%-7rem)] w-full max-w-5xl flex-1 flex-col overflow-hidden p-4"
>
    <div class="h-full overflow-auto">
        <slot />
    </div>
</main>

<footer class="fixed bottom-0 flex h-16 w-full flex-col items-center justify-center bg-indigo-50 p-4">
    <p class="max-w-full text-center">
        Copyright © 2022 <a href="https://github.com/DesireMonsterNFT" class="font-bold">Desire Monster NFT</a>.
        <br class="sm:hidden" />
        All rights reserved.
    </p>
</footer>
