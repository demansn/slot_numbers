export function createBuildSettings(options) {
    return {
        entryPoints: ['src/main.js'],
        outfile: 'www/bundle.js',
        bundle: true,
        ...options
    };
}
