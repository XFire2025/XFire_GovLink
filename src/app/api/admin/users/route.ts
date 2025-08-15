// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/db';
import User from '@/lib/models/userSchema';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

function mapStatusToAccountStatuses(uiStatus?: string) {
  if (!uiStatus || uiStatus === 'all') return undefined;
  if (uiStatus === 'active') return ['active'];
  if (uiStatus === 'pending') return ['pending_verification', 'under_review'];
  if (uiStatus === 'suspended') return ['suspended', 'deactivated'];
  return undefined;
}

export async function GET(req: NextRequest) {
  await connect();
  const { search = '', status = 'all', page = '1', limit = '20' } =
    Object.fromEntries(req.nextUrl.searchParams);

 const filter: { [key: string]: unknown } = {};

  if (search) {
    const regex = new RegExp(search as string, 'i');
    filter.$or = [{ fullName: regex }, { email: regex }];
  }

  const statuses = mapStatusToAccountStatuses(status as string);
  if (statuses) filter.accountStatus = { $in: statuses };

  const p = Number(page) || 1;
  const l = Math.min(Number(limit) || 20, 100);
  const skip = (p - 1) * l;

  const [data, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).lean(),
    User.countDocuments(filter),
  ]);

  return NextResponse.json({ data, total, page: p, limit: l });
}

export async function POST(req: NextRequest) {
  await connect();
  const body = await req.json();

  // Required minimum fields for User creation
  const required = ['fullName', 'email', 'password', 'nicNumber', 'dateOfBirth', 'mobileNumber'];
  for (const key of required) {
    if (!body[key]) {
      return NextResponse.json({ message: `Missing field: ${key}` }, { status: 400 });
    }
  }

  const hashed = await bcrypt.hash(body.password, 12);
  body.password = hashed;

  try {
    const user = await User.create(body);
    return NextResponse.json(user, { status: 201 });
 } catch (err) {
    const error = err as Error;
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}