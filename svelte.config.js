import adapter from "@sveltejs/adapter-auto";
import static_adapter from "@sveltejs/adapter-static";
import preprocess from "svelte-preprocess";
import Icons from "unplugin-icons/vite";

const static_build = true;

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://github.com/sveltejs/svelte-preprocess
    // for more information about preprocessors
    preprocess: preprocess(),

    kit: {
        adapter: static_build ? static_adapter() : adapter(),
        vite: {
            plugins: [Icons({ compiler: "svelte" })],
        },
    },
};

export default config;
