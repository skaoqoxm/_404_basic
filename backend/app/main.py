"""
FastAPI 应用入口
建表，健康检查接口后续挂路由
"""
from fastapi import FastAPI

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


@app.middleware("http")
async def log_request(request: Request, call_next):
    """打印请求详情，方便调试"""
    print("=== Request ===")
    print(f"Method: {request.method}")
    print(f"URL: {request.url}")
    print(f"Content-Type: {request.headers.get('content-type')}")
    body = await request.body()
    print(f"Body: {body}")
    response = await call_next(request)
    print(f"Status: {response.status_code}")
    print("=== End ===")
    return response