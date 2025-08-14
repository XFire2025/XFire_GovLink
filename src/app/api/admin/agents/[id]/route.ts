// app/api/admin/agents/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/db';
import Agent from '@/lib/models/agentSchema';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connect();
  const { id } = await params;
  
  if (!mongoose.isValidObjectId(id))
    return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });

  const agent = await Agent.findById(id);
  if (!agent) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(agent);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connect();
  const { id } = await params;
  
  if (!mongoose.isValidObjectId(id))
    return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });

  const payload = await req.json();

  const allowed = [
    'fullName',
    'email',
    'phoneNumber',
    'isActive',
    'isEmailVerified',
    'department',
    'branch',
    'position',
    'officeName',
    'officeAddress',
    'duties',
    'specialization',
    'password',
  ];
  const updates: Record<string, unknown> = {};
  for (const k of allowed) {
    if (k in payload) updates[k] = payload[k];
  }
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password as string, 12);
  }

  try {
    const updated = await Agent.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connect();
  const { id } = await params;
  
  if (!id) return NextResponse.json({ message: 'ID required' }, { status: 400 });
  
  try {
    const deleted = await Agent.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}