import type { ConfirmedDeal } from "./db";

// Uses Resend (resend.com) — simple REST API, no SDK needed.
// Sign up for free at resend.com, verify a sending domain, then add:
//   RESEND_API_KEY=re_...
//   DEAL_ALERT_TO=your@email.com
// to your Vercel environment variables.

function dealRow(d: ConfirmedDeal): string {
  const saving = `${d.pct_saving.toFixed(0)}% off 12-mo low`;
  const link = d.buy_url
    ? `<a href="${d.buy_url}" style="color:#C8963C;">Buy →</a>`
    : "";
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #1A3D58;vertical-align:top;">
        <div style="font-weight:600;color:#D6CFBC;">${d.item_label}</div>
        <div style="font-size:12px;color:#6A91AC;margin-top:2px;">${d.brand} · ${d.retailer} · Approved: ${d.approval_source}</div>
      </td>
      <td style="padding:10px 0 10px 16px;border-bottom:1px solid #1A3D58;white-space:nowrap;vertical-align:top;text-align:right;">
        <div style="font-size:18px;font-weight:700;color:#4E9C6A;">$${d.current_price.toFixed(2)}</div>
        <div style="font-size:11px;color:#6A91AC;">${saving}</div>
        <div style="margin-top:4px;">${link}</div>
      </td>
    </tr>`;
}

function buildEmail(deals: ConfirmedDeal[]): string {
  const count = deals.length;
  const rows = deals.map(dealRow).join("");
  return `
<!DOCTYPE html>
<html>
<body style="background:#091E30;margin:0;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:0 auto;">
    <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#C8963C;margin-bottom:10px;">
      Sailing Gear · Weekly Deal Scan
    </div>
    <h1 style="color:#D6CFBC;font-size:22px;margin:0 0 6px;">
      ${count} confirmed deal${count === 1 ? "" : "s"} this week
    </h1>
    <p style="color:#6A91AC;font-size:13px;margin:0 0 24px;">
      All items below are at their 12-month low price and from a Practical Sailor–
      or Cruising World–approved brand.
    </p>
    <table style="width:100%;border-collapse:collapse;">
      ${rows}
    </table>
    <p style="color:#365672;font-size:11px;margin-top:24px;">
      Scan runs every Monday at 07:00 ET via the sailing-app Vercel cron.
    </p>
  </div>
</body>
</html>`;
}

export async function sendDealAlert(deals: ConfirmedDeal[]): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.DEAL_ALERT_TO;
  if (!apiKey || !to) {
    console.log("[deal-hunter] RESEND_API_KEY or DEAL_ALERT_TO not set — skipping email");
    return;
  }

  const count = deals.length;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Sailing App <deals@yourdomain.com>", // TODO: replace with your verified Resend domain
      to: [to],
      subject: `⚓ ${count} sailing gear deal${count === 1 ? "" : "s"} · ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
      html: buildEmail(deals),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[deal-hunter] Resend error:", body);
  }
}
