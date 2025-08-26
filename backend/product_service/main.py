from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.product_router import router as product_router
from db.session import engine, Base, session
import uvicorn

def app() -> FastAPI:
    app = FastAPI(root_path="/api")
    app.include_router(product_router)
    @app.on_event("startup")
    async def startup():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    @app.on_event("shutdown")
    async def shutdown():
        await engine.dispose()

    return app

app = app()

origins = [
    "http://localhost:3000",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # список разрешённых доменов
    allow_credentials=True,         # нужны если используешь куки/сессии
    allow_methods=["*"],            # разрешаем все методы (GET, POST, DELETE и т.д.)
    allow_headers=["*"],            # разрешаем любые заголовки
)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)

