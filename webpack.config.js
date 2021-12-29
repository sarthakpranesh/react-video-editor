module.exports = {
    resolve: {
        fallback: {
            "path": require.resolve("path-browserify"),
            "fs": require.resolve("browserify-fs"),
        }
    },
    node: {
        fs: "empty",
    },
}