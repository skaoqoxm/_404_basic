"""
安全工具：JWT Token 生成、验证+密码哈希

"""

from datetime import datetime, timedelta,timezone
from jose import jwt, JWTError
from passlib.context import CryptContext
import bcrypt
from app.config import settings


# 密码哈希
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """注册时：明文密码 → 哈希"""
    # bcrypt.hashpw 需要 bytes，返回 bytes，存的时候转成 str
    # bcrypt 自动生成随机盐，每次结果不同
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    return hashed.decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    """登录时：比对明文和哈希"""
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except ValueError:
        # 哈希格式不对的情况
        return False
#JWT Token 生成和验证
def create_access_token(user_id: int) -> str:
    """
    生成 JWT Token,把user_id和过期时间编码进token
    """
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload={"sub":str(user_id),"exp":expire}
    return jwt.encode(payload,settings.SECRET_KEY,algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> int:
    """
    解码 JWT Token,返回user_id
    """
    try:
        payload = jwt.decode(token,settings.SECRET_KEY,algorithms=[settings.ALGORITHM])
        user_id:str = payload.get("sub")
        if user_id is None:
            raise ValueError("Token中没有用户ID")
        return user_id
    except JWTError as e:
        raise ValueError("Token无效或已过期") from e