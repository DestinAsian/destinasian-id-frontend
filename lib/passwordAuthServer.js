import crypto from "crypto";

function getGraphQLEndpoint() {
  const base =
    process.env.WORDPRESS_URL ||
    process.env.NEXT_PUBLIC_WORDPRESS_URL ||
    process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (!base) return null;
  if (base.endsWith("/graphql")) return base;
  return `${base.replace(/\/$/, "")}/graphql`;
}

function getPasswordQuery(contentType) {
  switch (contentType) {
    case "page":
      return {
        query: `query GetPagePassword($databaseId: ID!) {\n  page(id: $databaseId, idType: DATABASE_ID) {\n    passwordProtected {\n      onOff\n      password\n    }\n  }\n}`,
        dataKey: "page",
      };
    case "post":
      return {
        query: `query GetPostPassword($databaseId: ID!) {\n  post(id: $databaseId, idType: DATABASE_ID) {\n    passwordProtected {\n      onOff\n      password\n    }\n  }\n}`,
        dataKey: "post",
      };
    case "contest":
      return {
        query: `query GetContestPassword($databaseId: ID!) {\n  contest(id: $databaseId, idType: DATABASE_ID) {\n    passwordProtected {\n      onOff\n      password\n    }\n  }\n}`,
        dataKey: "contest",
      };
    case "travelGuide":
      return {
        query: `query GetTravelGuidePassword($databaseId: ID!) {\n  travelGuide(id: $databaseId, idType: DATABASE_ID) {\n    passwordProtected {\n      onOff\n      password\n    }\n  }\n}`,
        dataKey: "travelGuide",
      };
    case "luxuryTravel":
      return {
        query: `query GetLuxuryTravelPassword($databaseId: ID!) {\n  luxuryTravel(id: $databaseId, idType: DATABASE_ID) {\n    passwordProtected {\n      onOff\n      password\n    }\n  }\n}`,
        dataKey: "luxuryTravel",
      };
    default:
      return null;
  }
}

export async function fetchPasswordProtected({ contentType, databaseId }) {
  const endpoint = getGraphQLEndpoint();
  if (!endpoint) {
    throw new Error("Missing WORDPRESS_URL/NEXT_PUBLIC_WORDPRESS_URL");
  }

  const queryConfig = getPasswordQuery(contentType);
  if (!queryConfig) {
    throw new Error("Unsupported contentType");
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: queryConfig.query,
      variables: { databaseId },
    }),
  });

  const json = await res.json();
  if (json?.errors) {
    throw new Error("GraphQL error");
  }

  return json?.data?.[queryConfig.dataKey]?.passwordProtected || null;
}

export function buildAuthToken({ contentType, databaseId, password }) {
  const secret = process.env.PASSWORD_AUTH_SECRET;
  if (!secret) return password;

  return crypto
    .createHmac("sha256", secret)
    .update(`${contentType}:${databaseId}:${password}`)
    .digest("hex");
}

export function readCookie(req, name) {
  const header = req.headers?.cookie;
  if (!header) return null;

  const cookies = header.split(";");
  for (const part of cookies) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return decodeURIComponent(rest.join("="));
  }

  return null;
}

export function buildCookie(token) {
  const parts = [
    `pp_auth=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=86400",
  ];

  if (process.env.NODE_ENV === "production") {
    parts.push("Secure");
  }

  return parts.join("; ");
}
