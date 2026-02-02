export async function onRequest(context: any) {
  const url = new URL(context.request.url);

  // Allow real static assets through (js, css, images, fonts, etc.)
  // Anything that contains a dot is treated like a file: /assets/app.js, /favicon.ico, etc.
  if (url.pathname.includes(".")) {
    return context.next();
  }

  // For all other routes, serve the SPA entry (index.html)
  // so React Router can handle /worldcup/toronto, etc.
  const indexUrl = new URL("/index.html", url);
  return context.env.ASSETS.fetch(new Request(indexUrl, context.request));
}
