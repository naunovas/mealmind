from pydantic import BaseModel
from typing import Optional

class MealPlanCreate(BaseModel):
    recipe_id: int
    day_of_week: str

class MealPlanResponse(BaseModel):
    id: int
    user_id: int
    recipe_id: int
    day_of_week: str

    class Config:
        from_attributes = True