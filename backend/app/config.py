"""
配置管理：从 .env 文件读取所有环境变量
原理：pydantic-settings 在启动时读取 .env，把变量变成强类型对象
"""
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # 数据库配置
    MYSQL_HOST: str
    MYSQL_PORT: int
    MYSQL_USER: str
    MYSQL_PASSWORD: str
    MYSQL_DATABASE: str

    # Redis 配置
    REDIS_HOST: str
    REDIS_PORT: int
    REDIS_PASSWORD: str
    REDIS_DB: int

    #JWT
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int=60
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


    @property #@property装饰器是一种用于创建只读属性的便捷方式
    def mysql_url(self) -> str:
        return (f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}"
        f"@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}"
        f"?charset=utf8mb4"
        )
    @property
    def redis_url(self) -> str:
        pwd = f":{self.REDIS_PASSWORD}@" if self.REDIS_PASSWORD else ""
        return f"redis://{pwd}{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
settings = Settings()