// 'use client';
// import { useState } from "react";
// import styles from "./NewsletterForm.module.scss";

// export default function NewsletterForm() {
//   const [email, setEmail] = useState("");
//   const [status, setStatus] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setStatus("Loading...");

//     try {
//       const res = await fetch("/api/subscribe", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setStatus("✅ Berhasil! Terima kasih sudah subscribe.");
//         setEmail("");
//       } else {
//         setStatus(`❌ Error: ${data.message}`);
//       }
//     } catch (err) {
//       console.error(err);
//       setStatus("❌ Error: Tidak bisa connect ke server.");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className={styles.newsletterForm}>
//       {status && (
//         <p className={status.includes("✅") ? "success" : status.includes("❌") ? "error" : ""}>
//           {status}
//         </p>
//       )}
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//       />
//       <button type="submit">SUBSCRIBE</button>
//     </form>
//   );
// }


"use client";
import { useState } from "react";
import styles from "./NewsletterForm.module.scss";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Loading...");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("Berhasil! Terima kasih sudah subscribe.");
        setEmail("");
      } else {
        setStatus(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setStatus("Error: Tidak bisa connect ke server.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.newsletterForm}>
      {status && (
        <p className={status.toLowerCase().includes("error") ? "error" : "success"}>
          {status}
        </p>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">SUBSCRIBE</button>
    </form>
  );
}
