from pydantic import BaseModel

class SafeUserModel(BaseModel):
	username: str
	email: str