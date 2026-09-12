"""
数据条目ORM模型
对应数据库表：items
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Item(Base):
    """数据条目表：存储用户创建的数据条目"""
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    status = Column(String(20), default="active")
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # 外键关联到 users 表的 id 字段
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    # 关系定义：一个数据条目属于一个用户
    owner = relationship("User", back_populates="items")  # 关联到 User 表的 items 字段

    def __repr__(self):
        return f"<Item(id={self.id}, title='{self.title}', owner_id={self.owner_id})>"