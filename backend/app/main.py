from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import Base, engine
from app.models import User, Recipe, Ingredient, RecipeIngredient, MealPlan
from app.routes.auth import router as auth_router
from app.routes.recipes import router as recipes_router
from app.routes.ingredients import router as ingredients_router
from app.routes.meal_plan import router as meal_plan_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MealMind API",
    description="Smart meal planning and recipe recommendation system",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(recipes_router)
app.include_router(ingredients_router)
app.include_router(meal_plan_router)

@app.get("/")
def home():
    return {"message": "MealMind API is running"}