from fastapi import HTTPException
from typing import Any
from fastapi import status
from app.logger import logger
class HTTPBaseException(Exception):
    code = status.HTTP_500_INTERNAL_SERVER_ERROR
    message = "Unexpected server error (This should never happen)"
    extra_details: dict[str, Any] | None = None

    def __init__(self, message: str = None, extra_details: dict[str, Any] = None):
        if message:
            self.message = message
        if extra_details:
            self.extra_details = extra_details
        super().__init__(self.message)

# ==================== AUTHENTICATION & AUTHORIZATION ====================
class Unauthorized(HTTPBaseException):
    code = status.HTTP_401_UNAUTHORIZED
    message = "Unauthorized"

class Forbidden(HTTPBaseException):
    code = status.HTTP_403_FORBIDDEN
    message = "Forbidden"

class MustBeOwner(HTTPBaseException):
    code = status.HTTP_403_FORBIDDEN
    message = "You must be owner of the business to do this action"

class InvalidCredentials(HTTPBaseException):
    code = status.HTTP_401_UNAUTHORIZED
    message = "Invalid credentials"

class TokenExpired(HTTPBaseException):
    code = status.HTTP_401_UNAUTHORIZED
    message = "Token has expired"

class InvalidToken(HTTPBaseException):
    code = status.HTTP_401_UNAUTHORIZED
    message = "Invalid token"

# ==================== NOT FOUND ERRORS ====================
class NotFound(HTTPBaseException):
    code = status.HTTP_404_NOT_FOUND
    message = "Not found"

class UserNotFound(HTTPBaseException):
    code = status.HTTP_404_NOT_FOUND
    message = "User not found"

class CouponNotFound(HTTPBaseException):
    code = status.HTTP_404_NOT_FOUND
    message = "Coupon not found"

class NotificationNotFound(HTTPBaseException):
    code = status.HTTP_404_NOT_FOUND
    message = "Notification not found"

# ==================== VALIDATION ERRORS ====================
class BadRequest(HTTPBaseException):
    code = status.HTTP_400_BAD_REQUEST
    message = "Bad request"

class ValidationError(HTTPBaseException):
    code = status.HTTP_422_UNPROCESSABLE_ENTITY
    message = "Validation error"

class InvalidInput(HTTPBaseException):
    code = status.HTTP_400_BAD_REQUEST
    message = "Invalid input provided"

class InvalidEmailFormat(HTTPBaseException):
    code = status.HTTP_400_BAD_REQUEST
    message = "Invalid email format"

class InvalidPasswordFormat(HTTPBaseException):
    code = status.HTTP_400_BAD_REQUEST
    message = "Password must be at least 8 characters long"

class InvalidObjectId(HTTPBaseException):
    code = status.HTTP_400_BAD_REQUEST
    message = "Invalid ID format"

# ==================== CONFLICT ERRORS ====================
class IdAlreadyInUse(HTTPBaseException):
    code = status.HTTP_409_CONFLICT
    message = "ID already in use"

class UsernameAlreadyInUse(HTTPBaseException):
    code = status.HTTP_409_CONFLICT
    message = "Username already in use"

class EmailAlreadyInUse(HTTPBaseException):
    code = status.HTTP_409_CONFLICT
    message = "Email address already in use"

class CouponCodeAlreadyExists(HTTPBaseException):
    code = status.HTTP_409_CONFLICT
    message = "Coupon code already exists"

# ==================== COUPON SPECIFIC ERRORS ====================
class CouponExpired(HTTPBaseException):
    code = status.HTTP_400_BAD_REQUEST
    message = "Coupon has expired"

class CouponNotActive(HTTPBaseException):
    code = status.HTTP_400_BAD_REQUEST
    message = "Coupon is not active"

class CouponUsageLimitReached(HTTPBaseException):
    code = status.HTTP_400_BAD_REQUEST
    message = "Coupon usage limit has been reached"

class InvalidDiscountValue(HTTPBaseException):
    code = status.HTTP_400_BAD_REQUEST
    message = "Invalid discount value"

class InvalidDiscountType(HTTPBaseException):
    code = status.HTTP_400_BAD_REQUEST
    message = "Invalid discount type"

class InvalidDateRange(HTTPBaseException):
    code = status.HTTP_400_BAD_REQUEST
    message = "Invalid date range - start date must be before end date"

class CouponAlreadyUsed(HTTPBaseException):
    code = status.HTTP_400_BAD_REQUEST
    message = "Coupon has already been used"

# ==================== USER SPECIFIC ERRORS ====================
class UserBlocked(HTTPBaseException):
    code = status.HTTP_403_FORBIDDEN
    message = "User account is blocked"

class UserNotVerified(HTTPBaseException):
    code = status.HTTP_403_FORBIDDEN
    message = "User account is not verified"

class InvalidResetCode(HTTPBaseException):
    code = status.HTTP_400_BAD_REQUEST
    message = "Invalid or expired reset code"

class PasswordResetExpired(HTTPBaseException):
    code = status.HTTP_400_BAD_REQUEST
    message = "Password reset code has expired"

# ==================== PERMISSION ERRORS ====================
class InsufficientPermissions(HTTPBaseException):
    code = status.HTTP_403_FORBIDDEN
    message = "Insufficient permissions to perform this action"

class AdminOnlyAction(HTTPBaseException):
    code = status.HTTP_403_FORBIDDEN
    message = "This action requires admin privileges"

class SuperAdminOnlyAction(HTTPBaseException):
    code = status.HTTP_403_FORBIDDEN
    message = "This action requires super admin privileges"

# ==================== DATABASE ERRORS ====================
class DatabaseError(HTTPBaseException):
    code = status.HTTP_500_INTERNAL_SERVER_ERROR
    message = "Database operation failed"

class DuplicateKeyError(HTTPBaseException):
    code = status.HTTP_409_CONFLICT
    message = "Duplicate key error"

class ConnectionError(HTTPBaseException):
    code = status.HTTP_503_SERVICE_UNAVAILABLE
    message = "Service temporarily unavailable"

# ==================== EXTERNAL SERVICE ERRORS ====================
class EmailServiceError(HTTPBaseException):
    code = status.HTTP_503_SERVICE_UNAVAILABLE
    message = "Email service is currently unavailable"

class NotificationServiceError(HTTPBaseException):
    code = status.HTTP_503_SERVICE_UNAVAILABLE
    message = "Notification service is currently unavailable"

# ==================== MEDIA ERRORS ====================
class MediaNotSupported(HTTPBaseException):
    code = status.HTTP_415_UNSUPPORTED_MEDIA_TYPE
    message = "Media not supported"

class FileTooLarge(HTTPBaseException):
    code = status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
    message = "File too large"

class TooMany(HTTPBaseException):
    code = status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
    message = "Too many entities"

# ==================== RATE LIMITING ====================
class RateLimitExceeded(HTTPBaseException):
    code = status.HTTP_429_TOO_MANY_REQUESTS
    message = "Rate limit exceeded"

# ==================== MISC ERRORS ====================
class NotImplemented(HTTPBaseException):
    code = status.HTTP_501_NOT_IMPLEMENTED
    message = "Functionality not yet implemented"

class ServiceUnavailable(HTTPBaseException):
    code = status.HTTP_503_SERVICE_UNAVAILABLE
    message = "Service temporarily unavailable"












def handle_exception(e: Exception) -> HTTPException:
    """Convert custom exceptions to HTTP exceptions"""
    if isinstance(e, HTTPBaseException):
        return HTTPException(
            status_code=e.code,
            detail={
                "message": e.message,
                "extra_details": e.extra_details
            }
        )
    else:
        logger.error(f"Unexpected error: {e}")
        return HTTPException(
            status_code=500,
            detail="Internal server error"
        )