from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.order_router import router as order_router
from db.session import engine, Base, session
import uvicorn

def app() -> FastAPI:
    app = FastAPI(root_path="/api")

    origins = [
        "http://localhost:3000",   # твой Next.js
        "http://127.0.0.1:3000",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,          # можно указать ["*"] для всех, но лучше явно
        allow_credentials=True,
        allow_methods=["*"],            # ["GET", "POST", ...] если хочешь ограничить
        allow_headers=["*"],
    )

    app.include_router(order_router)
    @app.on_event("startup")
    async def startup():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    @app.on_event("shutdown")
    async def shutdown():
        await engine.dispose()

    return app

app = app()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8003, reload=True)

