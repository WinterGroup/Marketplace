from pydantic import BaseModel
from datetime import datetime

class ConfirmationModel(BaseModel):
    link: str
    username: str 
    email: str
    expiration: datetime