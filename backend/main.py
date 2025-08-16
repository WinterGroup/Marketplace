from fastapi import FastAPI
from api.v1.endpoints.main import router as main_router
from api.v1.endpoints.authentication import router as auth_router
from db.session import session, Base, engine
from middlewares.refresh_token_middleware import RefreshTokenMiddleware
import uvicorn
import os

def app() -> FastAPI:
	application = FastAPI(root_path="/api")
	application.include_router(main_router)
	application.include_router(auth_router)
	application.add_middleware(RefreshTokenMiddleware)

	@application.on_event("startup")
	def startup():
		Base.metadata.create_all(engine)

	@application.on_event("shutdown")
	def shutdown():
		session.close()

	return application

app = app()

if __name__ == "__main__":
	uvicorn.run("main:app", host="localhost", port=8080, reload=True)
