from pydantic import BaseModel

class Token(BaseModel):
    """
    登录成功返回给前端
    """
    access_token:str
    token_type:str="bearer"

class Tokendata(BaseModel):
    """
    从 JWT 中解析出的数据（内部用）
    """
    user_id:int | None = None