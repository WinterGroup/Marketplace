from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from typing import Callable


engine = create_engine("postgresql://postgres:postgres@db/db")
Base = declarative_base()
Session = sessionmaker(bind=engine)
session = Session()

def connection(func: Callable) -> Callable:
	def wraper(*args, **kwargs):
		try:
			return func(*args, **kwargs)
		except Exception as e:
			args[0].session.rollback()
			raise e
		finally:
			args[0].session.close()
	return wraper
