module.exports = async (req, res) => {
  const target = req.query.url;
  if (!target) {
    res.statusCode = 400;
    res.end("Missing url");
    return;
  }

  try {
    const upstream = await fetch(target, { redirect: "follow" });

    res.statusCode = upstream.status;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "no-store");

    const contentType = upstream.headers.get("content-type") || "application/octet-stream";
    res.setHeader("Content-Type", contentType);

    const arrayBuffer = await upstream.arrayBuffer();
    const buf = Buffer.from(arrayBuffer);
    res.end(buf);
  } catch (err) {
    res.statusCode = 500;
    res.end(String(err?.message || err));
  }
};
