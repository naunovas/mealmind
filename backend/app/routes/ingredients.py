from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db import get_db
from app.models import Ingredient, RecipeIngredient
from app.schemas.ingredient import IngredientCreate, IngredientResponse, RecipeIngredientCreate, RecipeIngredientResponse
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/ingredients", tags=["Ingredients"])

@router.get("/", response_model=List[IngredientResponse])
def get_all_ingredients(db: Session = Depends(get_db)):
    return db.query(Ingredient).all()

@router.post("/", response_model=IngredientResponse)
def create_ingredient(
    ingredient_data: IngredientCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    existing = db.query(Ingredient).filter(Ingredient.name == ingredient_data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ingredient already exists")
    
    new_ingredient = Ingredient(name=ingredient_data.name)
    db.add(new_ingredient)
    db.commit()
    db.refresh(new_ingredient)
    return new_ingredient

@router.post("/recipe/{recipe_id}", response_model=RecipeIngredientResponse)
def add_ingredient_to_recipe(
    recipe_id: int,
    data: RecipeIngredientCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    recipe_ingredient = RecipeIngredient(
        recipe_id=recipe_id,
        ingredient_id=data.ingredient_id,
        quantity=data.quantity
    )
    db.add(recipe_ingredient)
    db.commit()
    db.refresh(recipe_ingredient)
    return recipe_ingredient