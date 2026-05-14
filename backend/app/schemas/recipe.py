from pydantic import BaseModel
from typing import Optional

class RecipeCreate(BaseModel):
    title: str
    description: Optional[str] = None
    instructions: Optional[str] = None
    cooking_time: Optional[int] = None
    difficulty: Optional[str] = None
    calories: Optional[int] = None

class RecipeUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    instructions: Optional[str] = None
    cooking_time: Optional[int] = None
    difficulty: Optional[str] = None
    calories: Optional[int] = None

class RecipeResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    instructions: Optional[str]
    cooking_time: Optional[int]
    difficulty: Optional[str]
    calories: Optional[int]
    owner_id: int

    class Config:
        from_attributes = True