// app/api/admin/agents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/db';
import Agent from '@/lib/models/agentSchema';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  await connect();
  const { search = '', status = 'all', page = '1', limit = '20' } =
    Object.fromEntries(req.nextUrl.searchParams);

  const filter: Record<string, unknown> = {};
  if (search) {
    const regex = new RegExp(search as string, 'i');
    filter.$or = [{ fullName: regex }, { email: regex }, { officerId: regex }];
  }

  if (status !== 'all') {
    if (status === 'pending') {
      filter.isEmailVerified = false;
    } else if (status === 'active') {
      filter.isActive = true;
      filter.isEmailVerified = true;
    } else if (status === 'suspended') {
      filter.isActive = false;
    }
  }

  const p = Number(page) || 1;
  const l = Math.min(Number(limit) || 20, 100);
  const skip = (p - 1) * l;

  const [data, total] = await Promise.all([
    Agent.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).lean(),
    Agent.countDocuments(filter),
  ]);

  return NextResponse.json({ data, total, page: p, limit: l });
}

export async function POST(req: NextRequest) {
  await connect();
  const body = await req.json();

  // Required minimal fields to pass Agent schema requirements
  const required = [
    'fullName',
    'officerId',
    'nicNumber',
    'position',
    'officeName',
    'officeAddress',
    'phoneNumber',
    'email',
    'password',
  ];
  for (const key of required) {
    if (!body[key]) {
      return NextResponse.json({ message: `Missing field: ${key}` }, { status: 400 });
    }
  }
  const addrReq = ['addressLine1', 'city', 'district', 'province', 'postalCode'];
  for (const k of addrReq) {
    if (!body.officeAddress?.[k]) {
      return NextResponse.json({ message: `Missing officeAddress.${k}` }, { status: 400 });
    }
  }

  body.password = await bcrypt.hash(body.password, 12);

  try {
    const agent = await Agent.create(body);
    return NextResponse.json(agent, { status: 201 });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}