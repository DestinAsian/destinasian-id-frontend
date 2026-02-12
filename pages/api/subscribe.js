import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email wajib diisi" });
  }

  try {
    // -----------------------
    // 1️⃣ Ambil informasi tambahan otomatis
    // -----------------------
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // contoh API untuk IP -> location, bisa pakai freegeoip.app atau ipapi.co
    let location = { city: "", country: "", state: "", zip: "" };
    try {
      const locRes = await fetch(`https://ipapi.co/${ip}/json/`);
      const locData = await locRes.json();
      location = {
        city: locData.city || "",
        country: locData.country_name || "",
        state: locData.region || "",
        zip: locData.postal || "",
      };
    } catch (err) {
      console.warn("Gagal ambil lokasi:", err);
    }

    // -----------------------
    // 2️⃣ Siapkan payload MailerLite
    // -----------------------
    const bodyData = {
      email,
      name: "",  
      fields: {
        city: location.city,
        country: location.country,
        state: location.state,
        zip: location.zip,
        company: "",
        phone: "",
      },
    };

    const response = await fetch(
      `https://api.mailerlite.com/api/v2/groups/${process.env.MAILERLITE_GROUP_ID}/subscribers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-MailerLite-ApiKey": process.env.MAILERLITE_API_KEY,
        },
        body: JSON.stringify(bodyData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ message: data.error || "Gagal subscribe" });
    }

    res.status(200).json({ message: "Berhasil subscribe!", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
