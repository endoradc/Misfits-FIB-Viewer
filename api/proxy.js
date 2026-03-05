export default async function handler(req, res) {
  const target = req.query.url;
  if (!target) {
    res.status(400).send("Missing url");
    return;
  }

  try {
    const upstream = await fetch(target, { redirect: "follow" });

    res.status(upstream.status);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "no-store");

    const contentType = upstream.headers.get("content-type") || "application/octet-stream";
    res.setHeader("Content-Type", contentType);

    const buf = Buffer.from(await upstream.arrayBuffer());
    res.send(buf);
  } catch (err) {
    res.status(500).send(String(err?.message || err));
  }
}
