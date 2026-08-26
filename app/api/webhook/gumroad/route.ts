import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { createHmac } from 'crypto';

// Gumroad webhook secret for signature verification
// Get this from: https://gumroad.com/l/repurposer → Settings → Advanced → Webhooks
const GUMROAD_WEBHOOK_SECRET = process.env.GUMROAD_WEBHOOK_SECRET || '';

/**
 * Gumroad Webhook Handler
 *
 * Receives POST requests when a sale is completed (sale.completed event).
 * Verifies the webhook signature, looks up the Clerk user by email,
 * and sets publicMetadata.pro = true to permanently unlock their account.
 *
 * Configure in Gumroad: Settings → Advanced → Webhooks → Add webhook
 * URL: https://repurposer-tool.vercel.app/api/webhook/gumroad
 * Event: sale_completed
 */
export async function POST(request: NextRequest) {
  const body = await request.text();

  // Parse the form-encoded body
  const params = new URLSearchParams(body);
  const eventType = params.get('event_type') || params.get('type') || '';

  // Verify webhook signature if secret is configured
  if (GUMROAD_WEBHOOK_SECRET) {
    const signature = request.headers.get('X-Gumroad-Signature') || '';
    const expectedSignature = createHmac('sha256', GUMROAD_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Gumroad webhook signature mismatch');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  // Only process sale_completed events
  if (eventType !== 'sale_completed') {
    console.log(`Gumroad webhook: ignoring event type: ${eventType}`);
    return NextResponse.json({ message: 'Event ignored' }, { status: 200 });
  }

  // Extract email from the payload
  const email = params.get('email') || params.get('customer_email') || '';

  if (!email) {
    console.error('Gumroad webhook: no email in payload');
    return NextResponse.json({ error: 'No email provided' }, { status: 400 });
  }

  console.log(`Gumroad webhook: sale_completed for ${email}`);

  try {
    // Get the Clerk client (it's an async factory in Clerk v7)
    const client = await clerkClient();

    // Find the user in Clerk by email
    const userList = await client.users.getUserList({
      emailAddress: [email],
    });

    if (userList.totalCount === 0 || userList.data.length === 0) {
      console.warn(`Gumroad webhook: no Clerk user found for ${email}`);
      return NextResponse.json(
        { message: 'No user found, but webhook acknowledged' },
        { status: 200 }
      );
    }

    const user = userList.data[0];

    // Check if user is already pro (idempotency)
    const existingPro = user.publicMetadata?.pro === true;
    if (existingPro) {
      console.log(`Gumroad webhook: user ${user.id} already has pro metadata`);
      return NextResponse.json(
        { message: 'User already pro, no update needed' },
        { status: 200 }
      );
    }

    // Update user metadata: set pro = true
    await client.users.updateUser(user.id, {
      publicMetadata: {
        ...user.publicMetadata,
        pro: true,
      },
    });

    console.log(`Gumroad webhook: successfully set pro=true for user ${user.id}`);

    return NextResponse.json({
      message: 'User upgraded to pro',
      userId: user.id,
      email,
    }, { status: 200 });
  } catch (error) {
    console.error('Gumroad webhook: error processing sale:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET handler for webhook health check
export async function GET() {
  return NextResponse.json({
    message: 'Gumroad webhook endpoint is active',
    configured: !!GUMROAD_WEBHOOK_SECRET,
  });
}
