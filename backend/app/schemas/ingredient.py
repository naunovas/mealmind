from pydantic import BaseModel
from typing import Optional

class IngredientCreate(BaseModel):
    name: str

class IngredientResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class RecipeIngredientCreate(BaseModel):
    ingredient_id: int
    quantity: Optional[str] = None

class RecipeIngredientResponse(BaseModel):
    id: int
    recipe_id: int
    ingredient_id: int
    quantity: Optional[str]

    class Config:
        from_attributes = True