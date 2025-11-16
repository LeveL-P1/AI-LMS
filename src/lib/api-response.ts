import { NextResponse } from 'next/server'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
  timestamp: string
}

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    } as ApiResponse<T>,
    { status }
  )
}

export function errorResponse(
  code: string,
  message: string,
  status = 400,
  details?: unknown
) {
  const errorObj: {
    code: string
    message: string
    details?: unknown
  } = {
    code,
    message,
  }
  
  if (details) {
    errorObj.details = details
  }

  return NextResponse.json(
    {
      success: false,
      error: errorObj,
      timestamp: new Date().toISOString(),
    } as ApiResponse,
    { status }
  )
}

export function unauthorizedResponse() {
  return errorResponse('UNAUTHORIZED', 'Authentication required', 401)
}

export function forbiddenResponse() {
  return errorResponse('FORBIDDEN', 'You do not have permission to access this resource', 403)
}

export function notFoundResponse(resource: string) {
  return errorResponse('NOT_FOUND', `${resource} not found`, 404)
}

export function validationErrorResponse(details: unknown) {
  return errorResponse('VALIDATION_ERROR', 'Invalid request data', 400, details)
}

export function serverErrorResponse(message = 'Internal server error') {
  return errorResponse('SERVER_ERROR', message, 500)
}
