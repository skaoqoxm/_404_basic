"""
数据库连接层：MySQL (SQLAlchemy) + Redis
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import redis

from app.config import settings

#===MySQL 配置===
engine=create_engine(
    settings.mysql_url, 
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    pool_recycle=3600,
    echo=False,)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)  #创建链接放在连接池，自动提交关闭，自动刷新关闭

Base = declarative_base() #SQLAlchemy ORM 基类，用于定义模型类


#===RedisL 配置===
redis_client = redis.Redis.from_url(    #redis自动有连接池，from_url方法会自动创建连接池
    settings.redis_url, 
    decode_responses=True,)

# === FastAPI 依赖 ===
def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_redis():
    yield redis_client    