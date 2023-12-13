export default [
    {
        output: {
            filename: 'jsspeccyplus/jsspeccyplus.js',
        },
        name: 'jsspeccyplus',
        entry: './runtime/jsspeccyplus.js',
        mode: 'production',
        module: {
            rules: [
                {
                    test: /\.svg$/,
                    loader: 'svg-inline-loader',
                }
            ],
        }
    },
    {
        output: {
            filename: 'jsspeccyplus/jsspeccyplus-worker.js',
        },
        name: 'worker',
        entry: './runtime/worker.js',
        mode: 'production',
    },
];
