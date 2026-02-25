import {
  buildAuthToken,
  buildCookie,
  fetchPasswordProtected,
} from "@/lib/passwordAuthServer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false });
  }

  const { contentType, databaseId, password } = req.body || {};

  if (!contentType || !databaseId || typeof password !== "string") {
    return res.status(400).json({ ok: false });
  }

  try {
    const passwordProtected = await fetchPasswordProtected({
      contentType,
      databaseId,
    });

    if (!passwordProtected?.onOff) {
      return res.status(200).json({ ok: true });
    }

    if (password !== passwordProtected?.password) {
      return res.status(401).json({ ok: false });
    }

    const token = buildAuthToken({ contentType, databaseId, password });
    res.setHeader("Set-Cookie", buildCookie(token));

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ ok: false });
  }
}
