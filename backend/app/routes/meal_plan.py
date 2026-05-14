from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db import get_db
from app.models import MealPlan
from app.schemas.meal_plan import MealPlanCreate, MealPlanResponse
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/meal-plan", tags=["Meal Plan"])

@router.get("/", response_model=List[MealPlanResponse])
def get_my_meal_plan(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return db.query(MealPlan).filter(MealPlan.user_id == current_user.id).all()

@router.post("/", response_model=MealPlanResponse)
def add_to_meal_plan(
    data: MealPlanCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    existing = db.query(MealPlan).filter(
        MealPlan.user_id == current_user.id,
        MealPlan.day_of_week == data.day_of_week
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already have a meal planned for this day")
    
    meal_plan = MealPlan(
        user_id=current_user.id,
        recipe_id=data.recipe_id,
        day_of_week=data.day_of_week
    )
    db.add(meal_plan)
    db.commit()
    db.refresh(meal_plan)
    return meal_plan

@router.delete("/{meal_plan_id}")
def remove_from_meal_plan(
    meal_plan_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    meal_plan = db.query(MealPlan).filter(
        MealPlan.id == meal_plan_id,
        MealPlan.user_id == current_user.id
    ).first()
    if not meal_plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    
    db.delete(meal_plan)
    db.commit()
    return {"message": "Removed from meal plan"}