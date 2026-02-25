import {
  buildAuthToken,
  fetchPasswordProtected,
  readCookie,
} from "@/lib/passwordAuthServer";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ ok: false });
  }

  const { contentType, databaseId } = req.query || {};

  if (!contentType || !databaseId) {
    return res.status(400).json({ ok: false });
  }

  const token = readCookie(req, "pp_auth");
  if (!token) {
    return res.status(200).json({ ok: false });
  }

  try {
    const passwordProtected = await fetchPasswordProtected({
      contentType,
      databaseId,
    });

    if (!passwordProtected?.onOff) {
      return res.status(200).json({ ok: true });
    }

    const expected = buildAuthToken({
      contentType,
      databaseId,
      password: passwordProtected?.password || "",
    });

    return res.status(200).json({ ok: token === expected });
  } catch {
    return res.status(500).json({ ok: false });
  }
}
