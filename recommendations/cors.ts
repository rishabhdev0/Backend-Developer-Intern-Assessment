// F8: never use a wildcard origin on endpoints that return non-public data
const ALLOWED_ORIGIN = "https://www.cynbit.in";

export function withCors(body: BodyInit | null, init: ResponseInit = {}) {
  return new Response(body, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      Vary: "Origin",
    },
  });
}
