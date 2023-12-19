export default [
    {
        output: {
            filename: 'js8bits/js8bits.js',
        },
        name: 'js8bits',
        entry: './runtime/js8bits.js',
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
            filename: 'js8bits/zxspectrum-worker.js',
        },
        name: 'zxspectrum-worker',
        entry: './runtime/zxspectrum_worker.js',
        mode: 'production',
    },
];
