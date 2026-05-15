from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db import get_db
from app.models import Recipe
from app.schemas.recipe import RecipeCreate, RecipeUpdate, RecipeResponse
from app.core.dependencies import get_current_user
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Body
router = APIRouter(prefix="/recipes", tags=["Recipes"])

@router.get("/", response_model=List[RecipeResponse])
def get_all_recipes(
    db: Session = Depends(get_db),
    search: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    max_calories: Optional[int] = Query(None),
    max_cooking_time: Optional[int] = Query(None),
    skip: int = Query(0),
    limit: int = Query(10)
):
    query = db.query(Recipe).filter(Recipe.is_approved == True)
    if search:
        query = query.filter(Recipe.title.ilike(f"%{search}%"))
    if difficulty:
        query = query.filter(Recipe.difficulty == difficulty)
    if max_calories:
        query = query.filter(Recipe.calories <= max_calories)
    if max_cooking_time:
        query = query.filter(Recipe.cooking_time <= max_cooking_time)
    return query.offset(skip).limit(limit).all()

@router.get("/pending", response_model=List[RecipeResponse])
def get_pending_recipes(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admins only")
    return db.query(Recipe).filter(Recipe.is_approved == False).all()

@router.get("/my", response_model=List[RecipeResponse])
def get_my_recipes(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return db.query(Recipe).filter(Recipe.owner_id == current_user.id).all()

@router.get("/{recipe_id}", response_model=RecipeResponse)
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe

@router.post("/", response_model=RecipeResponse)
def create_recipe(
    recipe_data: RecipeCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    is_approved = current_user.role == "admin"
    new_recipe = Recipe(
        **recipe_data.model_dump(),
        owner_id=current_user.id,
        is_approved=is_approved
    )
    db.add(new_recipe)
    db.commit()
    db.refresh(new_recipe)
    return new_recipe

@router.put("/{recipe_id}/approve", response_model=RecipeResponse)
def approve_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admins only")
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    recipe.is_approved = True
    db.commit()
    db.refresh(recipe)
    return recipe

@router.put("/{recipe_id}", response_model=RecipeResponse)
def update_recipe(
    recipe_id: int,
    recipe_data: RecipeUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    if recipe.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not your recipe")
    for key, value in recipe_data.model_dump(exclude_unset=True).items():
        setattr(recipe, key, value)
    db.commit()
    db.refresh(recipe)
    return recipe

@router.delete("/{recipe_id}")
def delete_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    if recipe.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not your recipe")
    db.delete(recipe)
    db.commit()
    return {"message": "Recipe deleted"}
@router.post("/search-by-ingredients", response_model=List[RecipeResponse])
def search_by_ingredients(
    ingredient_names: List[str],
    db: Session = Depends(get_db)
):
    from app.models import Ingredient, RecipeIngredient
    
    matched_recipe_ids = set()
    
    for name in ingredient_names:
        ingredients = db.query(Ingredient).filter(
            Ingredient.name.ilike(f"%{name}%")
        ).all()
        
        for ingredient in ingredients:
            recipe_ingredients = db.query(RecipeIngredient).filter(
                RecipeIngredient.ingredient_id == ingredient.id
            ).all()
            for ri in recipe_ingredients:
                matched_recipe_ids.add(ri.recipe_id)
    
    if not matched_recipe_ids:
        return db.query(Recipe).filter(Recipe.is_approved == True).limit(10).all()
    
    return db.query(Recipe).filter(
        Recipe.id.in_(matched_recipe_ids),
        Recipe.is_approved == True
    ).all()