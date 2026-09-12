from datetime import datetime
from typing import Optional
from pydantic import BaseModel,Field,field_validator

class ItemBase(BaseModel):
    title: str
    description: Optional[str] = None

class ItemCreate(ItemBase):
    status: Optional[str] = Field(default="active", description="数据条目状态，默认为 active")

    @field_validator("status")
    @classmethod
    def validate_status(cls, v):
        if v not in ["active", "inactive"]:
            raise ValueError("状态必须为 'active' 或 'inactive'")
        return v

class ItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = Field(default=None, description="数据条目状态，默认为 active")

    @field_validator("status") #当 status 字段被赋值时，先跑这个函数检查一遍。
    @classmethod #普通方法：需要先创建实例才能调用,加了这个不创建实例也能调用，cls = UserCreate 这个类
    def validate_status(cls, v):
        if v is not None and v not in ["active", "inactive"]:
            raise ValueError("状态必须为 'active' 或 'inactive'")
        return v

class ItemResponse(ItemBase):
    id: int
    status: str
    owner_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  #启用 ORM 模式，允许从 ORM 对象创建 Pydantic 模型