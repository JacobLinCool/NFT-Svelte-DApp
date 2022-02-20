<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { spring } from "svelte/motion";
    import MdiPlus from "~icons/mdi/plus";
    import MdiMinus from "~icons/mdi/minus";

    const dispatch = createEventDispatcher();

    export let max = 10,
        min = 1;
    let count = 1;

    const displayed_count = spring();
    $: displayed_count.set(count);
    $: offset = mod($displayed_count, 1);

    function mod(n: number, m: number) {
        return ((n % m) + m) % m;
    }

    function increase() {
        count = Math.min(count + 1, max);
        dispatch("changed", { count });
    }

    function decrease() {
        count = Math.max(count - 1, min);
        dispatch("changed", { count });
    }
</script>

<div class="my-4 flex border-y border-black/10">
    <button on:click={decrease} aria-label="Decrease the counter by one">
        <MdiMinus />
    </button>

    <div class="counter-viewport">
        <div class="counter-digits" style="transform: translate(0, {100 * offset}%)">
            <strong class="hidden" aria-hidden="true">{Math.floor($displayed_count + 1)}</strong>
            <strong>{Math.floor($displayed_count)}</strong>
        </div>
    </div>

    <button on:click={increase} aria-label="Increase the counter by one">
        <MdiPlus />
    </button>
</div>

<style>
    button {
        @apply flex w-10 items-center justify-center border-0 bg-transparent p-0 text-3xl text-gray-800;
    }

    button:hover {
        @apply bg-indigo-100;
    }

    .counter-viewport {
        @apply h-16 w-32 overflow-hidden text-center;
    }

    .counter-viewport strong {
        @apply absolute flex h-full w-full items-center justify-center text-6xl font-normal text-indigo-600;
    }

    .counter-digits {
        @apply absolute h-full w-full;
    }

    .hidden {
        @apply -top-full select-none;
    }
</style>
