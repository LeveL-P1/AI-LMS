import { NextResponse } from 'next/server'

export type ApiError = { code: string; message: string }

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, init)
}

export function fail(error: ApiError, init?: ResponseInit) {
  return NextResponse.json({ success: false, error }, init)
}
