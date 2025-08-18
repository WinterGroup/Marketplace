from fastapi import FastAPI
from routers.users_router import router as users_router
from db.session import engine, Base, session
import uvicorn

def app() -> FastAPI:
    app = FastAPI()
    app.include_router(users_router)
    @app.on_event("startup")
    def startup():
        Base.metadata.create_all(engine)

    @app.on_event("shutdown")
    def shutdown():
        session.close()

    return app

app = app()

if __name__ == "__main__":
	uvicorn.run("main:app", host="localhost", port=8080, reload=True)

