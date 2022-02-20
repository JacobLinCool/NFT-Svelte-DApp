<script lang="ts">
    import { page } from "$app/stores";
    import MdiGithub from "~icons/mdi/github";
    import CryptocurrencyEth from "~icons/cryptocurrency/eth";
</script>

<header class="fixed top-0 left-0 z-10 flex w-full justify-between">
    <div class="corner">
        <a href="/">
            <CryptocurrencyEth />
        </a>
    </div>

    <nav class="flex justify-center">
        <svg viewBox="0 0 2 3" aria-hidden="true">
            <path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
        </svg>
        <ul>
            <li class:active={$page.url.pathname === "/"}>
                <a sveltekit:prefetch href="/">Home</a>
            </li>
            <li class:active={$page.url.pathname === "/library"}>
                <a sveltekit:prefetch href="/library">Library</a>
            </li>
            <li class:active={$page.url.pathname === "/about"}>
                <a sveltekit:prefetch href="/about">About</a>
            </li>
        </ul>
        <svg viewBox="0 0 2 3" aria-hidden="true">
            <path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
        </svg>
    </nav>

    <div class="corner">
        <a href="https://github.com/JacobLinCool/NFT-Svelte-DApp">
            <MdiGithub />
        </a>
    </div>
</header>

<style>
    .corner {
        @apply h-12 w-12;
    }

    .corner a {
        @apply flex h-full w-full items-center justify-center text-xl;
    }

    svg {
        @apply block h-12 w-8;
    }

    path {
        @apply fill-white/70;
    }

    ul {
        @apply m-0 flex h-12 list-none items-center justify-center bg-white/70 bg-contain p-0;
    }

    li {
        @apply h-full;
    }

    li.active::before {
        --size: 6px;
        content: "";
        width: 0;
        height: 0;
        position: absolute;
        top: 0;
        left: calc(50% - var(--size));
        border: var(--size) solid transparent;
        border-top: var(--size) solid var(--accent-color);
    }

    nav a {
        display: flex;
        height: 100%;
        align-items: center;
        padding: 0 1em;
        color: var(--heading-color);
        font-weight: 700;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        text-decoration: none;
        transition: color 0.2s linear;
    }

    a:hover {
        color: var(--accent-color);
    }
</style>
