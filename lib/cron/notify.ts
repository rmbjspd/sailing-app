import type { ConfirmedDeal } from "./db";
import { APPROVED_BRANDS } from "./approvedBrands";

// Uses Resend (resend.com) — simple REST API, no SDK needed.
// Add to your Vercel environment variables:
//   RESEND_API_KEY=re_...
//   DEAL_ALERT_TO=your@email.com
//   DEAL_ALERT_FROM="Sailing App <deals@your-verified-domain.com>"   (optional)
//
// Without DEAL_ALERT_FROM the alert is sent from Resend's shared test address,
// onboarding@resend.dev. Resend only delivers from that address to the email
// you signed up to Resend with, so DEAL_ALERT_TO must be that address, or you
// must verify a domain and set DEAL_ALERT_FROM.
const DEFAULT_FROM = "Sailing App <onboarding@resend.dev>";

/** Outcome of the alert step, returned in the scan result so it's visible. */
export type AlertStatus =
  | { status: "no_deals" }
  | { status: "sent"; id?: string }
  | { status: "not_configured"; missing: string[] }
  | { status: "failed"; error: string };

// Deal fields come from third-party shopping results, so escape them before
// putting them in HTML.
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeHttpUrl(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const u = new URL(raw);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch {
    return null;
  }
}

function approvalLabel(d: ConfirmedDeal): string {
  // Commodity categories make no claim about a publication, so there is
  // nothing to verify for them.
  if (d.approval_source.startsWith("Commodity")) return d.approval_source;
  const entry = APPROVED_BRANDS.find((b) => b.brand.toLowerCase() === d.brand.toLowerCase());
  return entry?.verified ? d.approval_source : `${d.approval_source} (unverified)`;
}

function dealRow(d: ConfirmedDeal): string {
  const saving = `${d.pct_saving.toFixed(0)}% below 12-mo median`;
  const url = safeHttpUrl(d.buy_url);
  const link = url ? `<a href="${esc(url)}" style="color:#C8963C;">Buy →</a>` : "";
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #1A3D58;vertical-align:top;">
        <div style="font-weight:600;color:#D6CFBC;">${esc(d.item_label)}</div>
        <div style="font-size:12px;color:#6A91AC;margin-top:2px;">${esc(d.brand)} · ${esc(d.retailer)} · Approved: ${esc(approvalLabel(d))}</div>
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
      Each item below is at its 12-month low, at least 5% below its typical
      price, and from a brand on your approved list. "(unverified)" means that
      brand's award hasn't been checked against the publication yet.
    </p>
    <table style="width:100%;border-collapse:collapse;">
      ${rows}
    </table>
    <p style="color:#365672;font-size:11px;margin-top:24px;">
      Scan runs every Monday at 07:00 ET via the sailing-app GitHub Actions schedule.
    </p>
  </div>
</body>
</html>`;
}

/** Env vars the alert email needs that aren't set. */
export function missingEmailConfig(): string[] {
  return [
    !process.env.RESEND_API_KEY && "RESEND_API_KEY",
    !process.env.DEAL_ALERT_TO && "DEAL_ALERT_TO",
  ].filter(Boolean) as string[];
}

export async function sendDealAlert(deals: ConfirmedDeal[]): Promise<AlertStatus> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.DEAL_ALERT_TO;
  const missing = missingEmailConfig();
  if (missing.length > 0) {
    console.error(`[deal-hunter] ${deals.length} deal(s) found but email not configured: missing ${missing.join(", ")}`);
    return { status: "not_configured", missing };
  }

  const count = deals.length;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.DEAL_ALERT_FROM || DEFAULT_FROM,
        to: [to],
        subject: `⚓ ${count} sailing gear deal${count === 1 ? "" : "s"} · ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
        html: buildEmail(deals),
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[deal-hunter] Resend error:", res.status, body);
      return { status: "failed", error: `Resend HTTP ${res.status}: ${body.slice(0, 300)}` };
    }
    const json = await res.json().catch(() => ({}));
    return { status: "sent", id: json?.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[deal-hunter] Resend request failed:", msg);
    return { status: "failed", error: msg };
  }
}
