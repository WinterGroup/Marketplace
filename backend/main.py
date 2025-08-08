from fastapi import FastAPI
from api.v1.endpoints.main import router as main_router

import uvicorn

def app() -> FastAPI:
	application = FastAPI(root_path="/api")
	application.include_router(main_router)

	return application

if __name__ == "__main__":
	uvicorn.run("main:app", host="localhost", port=8080, reload=True)