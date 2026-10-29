# Turbopack: source map filenames don't match their chunk

Minimal reproduction: with `productionBrowserSourceMaps: true`, Turbopack names each client source map independently of its chunk, instead of `<chunk>.js.map` like webpack. Upload tools that pair maps with minified files by filename (for example `datadog-ci sourcemaps upload`) can't match them.

## Steps

```bash
npm install

# Turbopack (default)
npm run build
npm run inspect
# => 0l1i137bxlimr.js -> 1trcvzd-l3i30.js.map (0l1i137bxlimr.js.map exists: false)
# => { matching: 0, mismatching: 6 }

# webpack, for comparison
npm run build:webpack
npm run inspect
# => { matching: 6, mismatching: 0 }
```

Pairing with `datadog-ci` (dry run, no API key needed):

```bash
npm run build
DATADOG_API_KEY=dummy npx @datadog/datadog-ci sourcemaps upload .next/static \
  --service=repro --release-version=1.0.0 \
  --minified-path-prefix=https://example.com/_next/static --dry-run --disable-git
# => Failed upload sourcemap for [.next/static/chunks/1trcvzd-l3i30.js.map]:
#    Missing corresponding JS file for sourcemap (.next/static/chunks/1trcvzd-l3i30.js)
```

Chunk hashes in the output above will differ on your machine.
