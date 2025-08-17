from pydantic import BaseModel


class SafeUserModel(BaseModel):
	id: int
	username: str
	email: str
	