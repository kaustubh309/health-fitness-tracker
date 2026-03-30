from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from app.schemas import nutrition
from app.core.food_data import FOOD_DATABASE
from app.api import deps
from app.models import models
router = APIRouter()

@router.post("/calculate", response_model=nutrition.DailyAnalysis)
async def calculate_nutrition(plan: nutrition.DailyPlanInput):
    daily_cals = 0
    daily_protein = 0
    daily_carbs = 0
    daily_fat = 0
    
    meals_output = []
    
    for meal in plan.meals:
        meal_cals = 0
        meal_p = 0
        meal_c = 0
        meal_f = 0
        items_output = []
        
        for item in meal.items:
            # Simple lookup logic
            name = item.name.lower().strip()
            macros = {"calories": 100, "protein": 5, "carbs": 15, "fat": 5} # default fallback
            
            # Lookup
            found = False
            for db_food, values in FOOD_DATABASE.items():
                if db_food in name or name in db_food:
                    macros = values
                    found = True
                    break
            
            # Scale by quantity (assuming items are 'servings' and DB is per serving)
            q = item.quantity if item.quantity else 1.0
            
            cals = macros["calories"] * q
            p = macros["protein"] * q
            c = macros["carbs"] * q
            f = macros["fat"] * q
            
            meal_cals += cals
            meal_p += p
            meal_c += c
            meal_f += f
            
            items_output.append(nutrition.FoodItemOutput(
                name=item.name,
                quantity=q,
                calories=cals,
                protein=p,
                carbs=c,
                fat=f
            ))
            
        meals_output.append(nutrition.MealOutput(
            name=meal.name,
            items=items_output,
            calories=meal_cals,
            protein=meal_p,
            carbs=meal_c,
            fat=meal_f
        ))
        
        daily_cals += meal_cals
        daily_protein += meal_p
        daily_carbs += meal_c
        daily_fat += meal_f

    # Generate suggestions
    suggestions = []
    if daily_cals < 1200:
        suggestions.append("Your calorie intake is very low. Ensure you are eating enough to fuel your body.")
    elif daily_cals > 3000:
        suggestions.append("Your calorie intake is quite high. Monitor portion sizes if weight loss is your goal.")
        
    if daily_protein < 50:
        suggestions.append("Try to increase your protein intake for muscle repair and satiety.")
        
    if daily_carbs > 300:
        suggestions.append("Carb intake is high. Consider swapping some refined carbs for vegetables or healthy fats.")
        
    return nutrition.DailyAnalysis(
        meals=meals_output,
        calories=daily_cals,
        protein=daily_protein,
        carbs=daily_carbs,
        fat=daily_fat,
        suggestions=suggestions
    )

@router.post("/", response_model=nutrition.NutritionLogResponse)
def create_nutrition_log(log: nutrition.NutritionLogCreate, db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_user)):
    db_log = models.NutritionLog(**log.dict(), owner_id=current_user.id)
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

@router.get("/", response_model=List[nutrition.NutritionLogResponse])
def get_nutrition_logs(skip: int = 0, limit: int = 100, db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_user)):
    return db.query(models.NutritionLog).filter(models.NutritionLog.owner_id == current_user.id).order_by(models.NutritionLog.date.desc()).offset(skip).limit(limit).all()

@router.delete("/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_nutrition_log(log_id: int, db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_user)):
    log = db.query(models.NutritionLog).filter(models.NutritionLog.id == log_id, models.NutritionLog.owner_id == current_user.id).first()
    if log is None:
        raise HTTPException(status_code=404, detail="Log not found")
    db.delete(log)
    db.commit()
    return None
