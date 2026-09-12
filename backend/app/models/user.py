"""
ORM表模型，RM（Object-Relational Mapping）就是用 Python 类代替 SQL 语句
比如建表	CREATE TABLE users (...)	定义 class User(Base)
插入	INSERT INTO users ...	db.add(user)
"""
from datetime import datetime,timezone

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship

from app.database import Base

class User(Base):
    """用户表：存储注册用户信息"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(128), nullable=False)
    is_active = Column(Integer, default=1)  # 1表示激活，0表示禁用
    created_at = Column(DateTime, default=datetime.now (timezone.utc))
    updated_at = Column(DateTime, default=datetime.now (timezone.utc), onupdate=datetime.now (timezone.utc))

    # 关系定义：一个用户可以有多个文章
    items = relationship("Item", back_populates="owner",cascade="all, delete-orphan")  # 关联到 Item 表的 owner 字段

    def __repr__(self): #__repr__ 是一个特殊方法，用于定义对象的字符串表示形式，方便调试和日志记录
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"