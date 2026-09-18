// language=HTML
const page = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=__REDIRECT_URL__" />
    <title>discord.builders · Use new components in your Discord webhooks</title>
    <meta name='description' content='Use new Discord components in messages for free and stylize your server however your want.'>
    <meta name="theme-color" content="#5865F2">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="discord.builders – Discord Embed Builder">
    <meta property="og:title" content="Content unavailable">
    <meta property="og:description" content="Please upgrade your Discord client to the latest version in order to see the content of this embed.">
    <meta property="og:url" content="__REDIRECT_URL__">
    <script id="discord:component-embed" type="application/json">__COMPONENT_JSON__</script>
</head>
<body>Redirecting to <a href="__REDIRECT_URL__">discord.builders</a>...</body>
</html>`;

export async function onRequestGet(context) {
    const url = new URL(context.request.url);
    const v1 = url.searchParams.get("v1")?.replace(/ /g, '+');

    if (!v1) {
        return new Response("Missing v1 parameter", { status: 400 });
    }

    let safeJson;
    try {
        const state = (await decodeState(v1))[0];
        safeJson = JSON.stringify({"component": state})
            .replace(/</g, '\\u003c')
            .replace(/>/g, '\\u003e')
            .replace(/&/g, '\\u0026');
    } catch (e) {
        return new Response("Invalid v1 payload", { status: 400 });
    }

    const redirectObj = new URL("https://discord.builders");
    redirectObj.hash = v1;

    const safeUrl = redirectObj.toString().replace(/"/g, "&quot;");
    const html = page.replace("__COMPONENT_JSON__", safeJson).replaceAll("__REDIRECT_URL__", safeUrl);

    return new Response(html, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'X-Content-Type-Options': 'nosniff',
            'Content-Security-Policy': "default-src 'none'; base-uri 'none'; form-action 'none'",
            'Referrer-Policy': 'no-referrer',
        },
    });
}

async function decodeState(data) {
    if (data.startsWith('1$')) {
        const cs = new DecompressionStream('gzip');
        const writer = cs.writable.getWriter();
        writer.write(Uint8Array.from(atob(data.slice(2)), (c) => c.charCodeAt(0)));
        writer.close();
        const state = await new Response(cs.readable).text();
        return JSON.parse(state);
    }
    return new Response("Only GZIP-compressed format is supported", { status: 400 });
}
