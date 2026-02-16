import { NextResponse } from "next/server";
import { ENV } from "@/shared/config";
import { appendSetCookies, getSetCookies } from "@/shared/lib/auth/bff";

const buildTargetUrl = (path: string[], search: string) =>
  `${ENV.API_URL}/api/${path.join("/")}${search}`;

/**
 * Hop-by-hop headers (must not be forwarded by proxies).
 */
const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

/**
 * These often break proxying/streaming when forwarded as-is.
 * We'll recompute them automatically by Next/Fetch.
 */
const STRIP_RESPONSE_HEADERS = new Set([
  ...HOP_BY_HOP_HEADERS,
  "content-length",
  "content-encoding",
]);

/**
 * Request headers that should not be forwarded to your API.
 */
const STRIP_REQUEST_HEADERS = new Set([
  ...HOP_BY_HOP_HEADERS,
  "host",
  "content-length",
  "accept-encoding", // avoid gzip/br mismatch issues when proxying
]);

const sanitizeRequestHeaders = (incoming: Headers) => {
  const h = new Headers(incoming);
  for (const key of STRIP_REQUEST_HEADERS) h.delete(key);
  return h;
};

const sanitizeResponseHeaders = (incoming: Headers) => {
  const h = new Headers();
  incoming.forEach((value, key) => {
    const k = key.toLowerCase();
    if (STRIP_RESPONSE_HEADERS.has(k)) return;
    if (k === "set-cookie") return; // handled manually below
    h.set(key, value);
  });
  return h;
};

const proxyRequest = async (request: Request, path: string[]) => {
  const targetUrl = buildTargetUrl(path, new URL(request.url).search);

  const isBodyAllowed = !["GET", "HEAD"].includes(request.method);

  const init: RequestInit & { duplex?: "half" } = {
    method: request.method,
    headers: sanitizeRequestHeaders(request.headers),
    body: isBodyAllowed ? request.body : undefined,
    cache: "no-store",
    redirect: "manual",
  };

  if (isBodyAllowed) {
    init.duplex = "half";
  }

  const response = await fetch(targetUrl, init);

  // Buffering avoids "pending/no response" issues caused by streaming + headers mismatch on prod.
  const body = await response.arrayBuffer();

  const nextResponse = new NextResponse(body, {
    status: response.status,
    statusText: response.statusText,
    headers: sanitizeResponseHeaders(response.headers),
  });

  // Preserve Set-Cookie (multiple cookies support)
  const setCookies = getSetCookies(response);
  if (setCookies.length) {
    nextResponse.headers.delete("set-cookie");
    appendSetCookies(nextResponse.headers, setCookies);
  }

  return nextResponse;
};

export const dynamic = "force-dynamic";

const resolvePath = async (context: {
  params: Promise<{ path?: string[] }>;
}) => {
  const params = await context.params;
  return params?.path ?? [];
};

export async function GET(
  request: Request,
  context: { params: Promise<{ path?: string[] }> },
) {
  const path = await resolvePath(context);
  return proxyRequest(request, path);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ path?: string[] }> },
) {
  const path = await resolvePath(context);
  return proxyRequest(request, path);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ path?: string[] }> },
) {
  const path = await resolvePath(context);
  return proxyRequest(request, path);
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ path?: string[] }> },
) {
  const path = await resolvePath(context);
  return proxyRequest(request, path);
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ path?: string[] }> },
) {
  const path = await resolvePath(context);
  return proxyRequest(request, path);
}
