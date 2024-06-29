process.env.NITRO_SSL_CERT = await Bun.file(process.env.SSL_CERT).text();
process.env.NITRO_SSL_KEY = await Bun.file(process.env.SSL_KEY).text();

await import('./.output/server/index.mjs');
