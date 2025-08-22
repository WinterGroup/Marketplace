from fastapi import FastAPI
from routers.order_router import router as order_router
from db.session import engine, Base, session
import uvicorn

def app() -> FastAPI:
    app = FastAPI(root_path="/api")
    app.include_router(order_router)
    @app.on_event("startup")
    def startup():
        Base.metadata.create_all(engine)

    @app.on_event("shutdown")
    def shutdown():
        session.close()

    return app

app = app()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8003, reload=True)

