import { NextResponse, NextRequest } from 'next/server';
import connect from '@/lib/db';
import ScheduledEmail from '@/lib/models/scheduledEmail';
import { sendEmail } from '@/lib/services/govlinkEmailService';

const MAX_BATCH = 200;

async function processDue() {
  await connect();
  const now = new Date();
  const due = await ScheduledEmail.find({ sent: false, scheduledAt: { $lte: now } }).limit(MAX_BATCH);

  const results: { id: string; to: string; ok: boolean; error?: string }[] = [];

  for (const item of due) {
    try {
      const res = await sendEmail({ to: item.to, subject: item.subject, html: item.html });
      const ok = !(res && res.success === false);
      if (ok) {
        item.sent = true;
        item.sentAt = new Date();
        await item.save();
        results.push({ id: String(item._id), to: item.to, ok: true });
      } else {
        results.push({ id: String(item._id), to: item.to, ok: false, error: (res && (res.error || res.message)) || 'unknown' });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      results.push({ id: String(item._id), to: item.to, ok: false, error: message });
    }
  }

  const sent = results.filter(r => r.ok).length;
  const failed = results.length - sent;
  return { processed: results.length, sent, failed, details: results };
}

function checkSecret(req: NextRequest) {
  const header = req.headers.get('x-cron-job-secret');
  const url = new URL(req.url);
  const q = url.searchParams.get('secret');
  const secret = process.env.CRON_JOB_SECRET || '';
  if (!secret) return false; // refuse if no secret configured
  if (header && header === secret) return true;
  if (q && q === secret) return true;
  return false;
}

export async function GET(req: NextRequest) {
  try {
    if (!checkSecret(req)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const summary = await processDue();
    return NextResponse.json({ success: true, ...summary }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message: 'Processing failed', error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Accept POST as well for services that prefer it
  return GET(req);
}
