from fastapi import FastAPI, HTTPException, Request
from contextlib import asynccontextmanager
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from app.config import settings
from pymongo import AsyncMongoClient
from beanie import init_beanie
from app.models.user import User
from app.api.user import router as user_router
from app.minio import init_minio_client
# from app.api.notif import router as notif_router
from app.models.notification import notification
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from app.api.Coupons import router as coupons_router
from app.exceptions import HTTPBaseException
from app.logger import logger
from app.models.Coupon import Coupon
from app.api.brand import router as brands_router
from app.api.categories import router as categorie_router
from app.api.analytics import router as analytics_router
from app.models.brand import Brands
from app.models.categories import Categorie

mongo_client = AsyncMongoClient(settings.MONGO_URI)
mongo_db = mongo_client[settings.MONGO_DB]

async def init_mongo():
    await init_beanie(database=mongo_db, document_models=[User, notification, Coupon, Brands, Categorie])

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_mongo()
    await init_minio_client(
        minio_host=settings.MINIO_HOST,
        minio_port=settings.MINIO_PORT,
        minio_root_user=settings.MINIO_ROOT_USER,
        minio_root_password=settings.MINIO_ROOT_PASSWORD
    )
    yield

app = FastAPI(lifespan=lifespan)

# Correct middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)
# app.add_middleware(HTTPSRedirectMiddleware)

@app.exception_handler(HTTPBaseException)
async def http_exception_handler(request: Request, exc: HTTPBaseException):
    return JSONResponse(
        status_code=exc.code,
        content={
            "error": {
                "message": exc.message,
                "code": exc.code,
                "extra_details": exc.extra_details
            }
        }
    )

@app.exception_handler(HTTPException)
async def fastapi_http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "message": exc.detail,
                "code": exc.status_code
            }
        }
    )
    
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "message": "Internal server error",
                "code": 500
            }
        }
    )

# Static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Include routers
app.include_router(user_router)
app.include_router(coupons_router)
app.include_router(brands_router)
app.include_router(categorie_router)
app.include_router(analytics_router)
