"""
FastAPI 应用入口
建表，健康检查接口后续挂路由
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, redis_client
from app.models import User, Item #先引用才会收集得到
from app.routers import auth
Base.metadata.create_all(bind=engine)  #收集ORM模型，创建数据库表
from pydantic import ValidationError
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI(
    title="FastAPI 后端服务",
    description="FastAPI 后端服务",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,prefix="/api/v1/auth",tags=["auth"])


@app.get("/")
async def health_check():
    """
    健康检查接口
    """
    redis_client.ping()
    return {"status": "ok",
            "service":"Nexus API",
            "database":"Mysql",
            "cache":"Redis"}



