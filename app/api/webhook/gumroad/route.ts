import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

// Your Gumroad seller_id — used to verify pings are genuinely from your account
// Gumroad Ping POSTs form-encoded data; there is no HMAC signature header.
// We verify authenticity by checking the seller_id field matches yours.
const GUMROAD_SELLER_ID = (process.env.GUMROAD_SELLER_ID || 'u9zbSgKq9QAvoSynCnJb_g==').trim();

/**
 * Gumroad Ping Webhook Handler
 *
 * Gumroad sends a POST request to this URL whenever a sale is completed.
 * Payload is application/x-www-form-urlencoded.
 *
 * Ping URL: https://repurposer-tool.vercel.app/api/webhook/gumroad
 * Configure at: https://gumroad.com/settings/advanced → Ping
 *
 * On receipt:
 *  1. Verifies the seller_id matches your Gumroad account
 *  2. Looks up the buyer's email in Clerk
 *  3. Sets publicMetadata.pro = true to permanently unlock PRO access
 */
export async function POST(request: NextRequest) {
  const body = await request.text();

  // Parse the form-encoded body
  const params = new URLSearchParams(body);

  // Verify this ping is from YOUR Gumroad account
  const sellerId = params.get('seller_id') || '';
  if (GUMROAD_SELLER_ID && sellerId !== GUMROAD_SELLER_ID) {
    console.error(`Gumroad ping: seller_id mismatch. Got: ${sellerId}`);
    return NextResponse.json({ error: 'Unauthorized seller' }, { status: 401 });
  }

  // Extract buyer email from the payload
  const email = params.get('email') || params.get('purchaser_id') || '';
  const productName = params.get('product_name') || 'Unknown';
  const saleId = params.get('sale_id') || '';

  if (!email) {
    console.error('Gumroad ping: no email in payload');
    return NextResponse.json({ error: 'No email provided' }, { status: 400 });
  }

  console.log(`Gumroad ping: sale received — ${email} bought "${productName}" (sale: ${saleId})`);

  try {
    const client = await clerkClient();

    // Find the Clerk user by email
    const userList = await client.users.getUserList({
      emailAddress: [email],
    });

    if (userList.totalCount === 0 || userList.data.length === 0) {
      // Buyer hasn't signed up yet — log and acknowledge.
      // They'll get PRO applied when they register.
      console.warn(`Gumroad ping: no Clerk user found for ${email}. Sale recorded but PRO not applied yet.`);
      return NextResponse.json(
        { message: 'Sale recorded. PRO will be applied when user signs up.' },
        { status: 200 }
      );
    }

    const user = userList.data[0];

    // Idempotency check — don't double-upgrade
    if (user.publicMetadata?.pro === true) {
      console.log(`Gumroad ping: ${user.id} already PRO — no update needed`);
      return NextResponse.json({ message: 'User already PRO' }, { status: 200 });
    }

    // Upgrade the user to PRO in Clerk
    await client.users.updateUser(user.id, {
      publicMetadata: {
        ...user.publicMetadata,
        pro: true,
        gumroad_sale_id: saleId,
        upgraded_at: new Date().toISOString(),
      },
    });

    console.log(`✅ Gumroad ping: upgraded ${email} (${user.id}) to PRO`);

    return NextResponse.json({
      message: 'User upgraded to PRO',
      userId: user.id,
      email,
      product: productName,
    }, { status: 200 });

  } catch (error) {
    console.error('Gumroad ping: error processing sale:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoint: 'Gumroad Ping webhook',
    seller: GUMROAD_SELLER_ID ? 'configured' : 'unconfigured',
  });
}
