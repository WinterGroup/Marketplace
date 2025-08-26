from pydantic import BaseModel

class RefreshModel(BaseModel):
	hash: str
	token: str