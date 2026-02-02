export async function onRequest(context: any) {
  const url = new URL(context.request.url);

  // Allow static assets (js, css, images, fonts, etc.)
  if (url.pathname.includes(".")) {
    return context.next();
  }

  // Serve SPA entry for all routes so React Router handles /worldcup/toronto
  return context.env.ASSETS.fetch(new Request(new URL("/index.html", url), context.request));
}
