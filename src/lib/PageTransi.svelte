<script lang="ts">
    import { fly } from "svelte/transition";
</script>

<div in:fly={{ y: -20, duration: 200, delay: 250 }} out:fly={{ y: -20, duration: 200 }}>
    <slot />
</div>
