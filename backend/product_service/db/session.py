from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from typing import Callable

engine = create_async_engine("postgresql+asyncpg://postgres:postgres@db:5432/db")
Base = declarative_base()
Session = async_sessionmaker(engine,class_=AsyncSession,expire_on_commit=False)
session = Session()

def connection(func: Callable) -> Callable:
	async def wraper(*args, **kwargs):
		try:
			return await func(*args, **kwargs)
		except Exception as e:
			await args[0].session.rollback()
			raise e
		finally:
			await args[0].session.close()
	return wraper
