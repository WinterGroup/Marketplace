from kafka import KafkaProducer
from core.config import KAFKA
from typing import Callable
import json


def producerExitDecorator(func: Callable) -> Callable:
	def wraper(*args, **kwargs):
		args[0].producer.start()
		try:
			return func(*args, **kwargs)
		except Exception:
			raise
		finally:
			args[0].producer.stop()
	return wraper