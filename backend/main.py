from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.responses import RedirectResponse

from routers import tasks, auth

app = FastAPI(title="my-todo-app")
app.include_router(tasks.router)
app.include_router(auth.router)


@app.get("/")
async def root():
    return RedirectResponse(url="/index.html")


app.mount("/", StaticFiles(directory="../frontend/build"), name="static")
