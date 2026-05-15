from sqlalchemy import Column, Integer, String, Enum, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db import Base
from sqlalchemy import Column, Integer, String, Enum, Text, ForeignKey, Boolean
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum("user", "admin", name="user_role"), default="user")

    recipes = relationship("Recipe", back_populates="owner")
    meal_plans = relationship("MealPlan", back_populates="user")
class MealPlan(Base):
    __tablename__ = "meal_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    recipe_id = Column(Integer, ForeignKey("recipes.id"))
    day_of_week = Column(Enum("monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", name="day_of_week"))

    user = relationship("User", back_populates="meal_plans")
    recipe = relationship("Recipe")
class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    instructions = Column(Text)
    cooking_time = Column(Integer)
    difficulty = Column(Enum("easy", "medium", "hard", name="difficulty_level"))
    calories = Column(Integer)
    owner_id = Column(Integer, ForeignKey("users.id"))
    is_approved = Column(Boolean, default=False)

    owner = relationship("User", back_populates="recipes")
    ingredients = relationship("RecipeIngredient", back_populates="recipe")
class Ingredient(Base):
    __tablename__ = "ingredients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    recipes = relationship("RecipeIngredient", back_populates="ingredient")
class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"

    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id"))
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"))
    quantity = Column(String, nullable=True)

    recipe = relationship("Recipe", back_populates="ingredients")
    ingredient = relationship("Ingredient", back_populates="recipes")
    