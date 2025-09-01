from repositories.redis_repository import RedisRepository, getRedisRepository
from models.confirmation_model import ConfirmationModel
from typing import Optional, List
from cryptography.fernet import Fernet
import os

class ConfirmationDAO():
    def __init__(self, repository: RedisRepository) -> None:
        self.repository = repository
        self.f = Fernet(os.environ.get("SECRET_KEY"))

    async def create(self, confirm: ConfirmationModel) -> Optional[ConfirmationModel]:
        confirm.link = self.f.encrypt(confirm.link.encode()).decode()
        return await self.repository.setItem(f"conf {confirm.username}", confirm)

    async def delete(self, confirm_key: str) -> None:
        return await self.repository.delete(confirm_key)

    async def get(self, confirm_key: str) -> Optional[ConfirmationModel]:
        item = await self.repository.getItem(confirm_key)
        if item:
            item.link = self.f.decrypt(item.link.encode())
            return item
        return None

def getConfirmationDAO() -> ConfirmationDAO:
    return ConfirmationDAO(getRedisRepository())
