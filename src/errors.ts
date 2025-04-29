export const HTTP_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpCode = (typeof HTTP_CODES)[keyof typeof HTTP_CODES];

export class PublicError extends Error {
  status: HttpCode;

  constructor(message: string, status: HttpCode) {
    super(message);
    this.status = status;
  }
}

export class UnauthorizedPublicError extends PublicError {
  constructor(message: string = "Unauthorized") {
    super(message, HTTP_CODES.UNAUTHORIZED);
  }
}

export class ForbiddenPublicError extends PublicError {
  constructor(message: string = "Forbidden") {
    super(message, HTTP_CODES.FORBIDDEN);
  }
}

export class NotFoundPublicError extends PublicError {
  constructor(message: string = "Not Found") {
    super(message, HTTP_CODES.NOT_FOUND);
  }
}

export class InternalServerErrorPublicError extends PublicError {
  constructor(message: string = "Internal Server Error") {
    super(message, HTTP_CODES.INTERNAL_SERVER_ERROR);
  }
}
