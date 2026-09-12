"""
用户相关的 Pydantic Schema
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel,EmailStr,Field,field_validator

# === 基础 Schema：公共字段 ===
class UserBase(BaseModel):
    username: str = Field(..., max_length=50, description="用户名")
    email: EmailStr = Field(..., max_length=100, description="邮箱地址")

# === 注册用：接收用户输入 ===
class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=128, description="密码")

    @field_validator("password",mode="after")
    @classmethod
    def validate_password(cls,v):
        if len(v) < 8:
            raise ValueError("密码长度至少为8位")
        return v
#更新用
class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, max_length=50, description="用户名")
    email: Optional[EmailStr] = Field(None, max_length=100, description="邮箱地址")
    password: Optional[str] = Field(None, min_length=6, max_length=128, description="密码")
    role: Optional[str] = Field(None, max_length=20, description="用户角色")

#响应用
class UserResponse(UserBase):
    id: int = Field(..., description="用户ID")
    is_active: bool = Field(..., description="是否激活")
    created_at: datetime = Field(..., description="创建时间")
    updated_at: datetime = Field(..., description="更新时间")

    class Config:
        from_attributes = True  #启用 ORM 模式，允许从 ORM 对象创建 Pydantic 模型