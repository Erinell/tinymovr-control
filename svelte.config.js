import preprocess from "svelte-preprocess"
import adapter from "@sveltejs/adapter-static"

export default {
    kit: {
        adapter: adapter({
            assets: 'build'
        }),
        alias: {
            $lib: "./src/lib"
        }
    },

    preprocess: preprocess(),
}
