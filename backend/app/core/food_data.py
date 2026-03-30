
# Simple database of common foods (per 100g or 1 serving typical)
# Values are: Calories (kcal), Protein (g), Carbs (g), Fat (g)
FOOD_DATABASE = {
    "apple": {"calories": 52, "protein": 0.3, "carbs": 14, "fat": 0.2},
    "banana": {"calories": 89, "protein": 1.1, "carbs": 23, "fat": 0.3},
    "chicken breast": {"calories": 165, "protein": 31, "carbs": 0, "fat": 3.6},
    "rice": {"calories": 130, "protein": 2.7, "carbs": 28, "fat": 0.3},
    "bread": {"calories": 265, "protein": 9, "carbs": 49, "fat": 3.2},
    "egg": {"calories": 155, "protein": 13, "carbs": 1.1, "fat": 11},
    "milk": {"calories": 42, "protein": 3.4, "carbs": 5, "fat": 1},
    "oats": {"calories": 389, "protein": 16.9, "carbs": 66, "fat": 6.9},
    "potato": {"calories": 77, "protein": 2, "carbs": 17, "fat": 0.1},
    "salmon": {"calories": 208, "protein": 20, "carbs": 0, "fat": 13},
    "broccoli": {"calories": 34, "protein": 2.8, "carbs": 7, "fat": 0.4},
    "almonds": {"calories": 579, "protein": 21, "carbs": 22, "fat": 49},
    "pasta": {"calories": 131, "protein": 5, "carbs": 25, "fat": 1.1},
    "yogurt": {"calories": 59, "protein": 10, "carbs": 3.6, "fat": 0.4},
    "cheese": {"calories": 402, "protein": 25, "carbs": 1.3, "fat": 33},
    "orange": {"calories": 47, "protein": 0.9, "carbs": 12, "fat": 0.1},
    "avocado": {"calories": 160, "protein": 2, "carbs": 9, "fat": 15},
    "steak": {"calories": 271, "protein": 26, "carbs": 0, "fat": 19},
    "tuna": {"calories": 132, "protein": 28, "carbs": 0, "fat": 1},
    "pizza": {"calories": 266, "protein": 11, "carbs": 33, "fat": 10},
    "burger": {"calories": 295, "protein": 17, "carbs": 30, "fat": 12},
    "salad": {"calories": 33, "protein": 1, "carbs": 7, "fat": 0}, 
    "chocolate": {"calories": 546, "protein": 4.9, "carbs": 61, "fat": 31},
    "coffee": {"calories": 0, "protein": 0, "carbs": 0, "fat": 0}
}

def get_food_info(food_name: str):
    """
    Search for food in database. Simple substring matching.
    """
    food_name = food_name.lower().strip()
    
    # Exact match
    if food_name in FOOD_DATABASE:
        return FOOD_DATABASE[food_name]
        
    # Substring match
    for db_food, macros in FOOD_DATABASE.items():
        if db_food in food_name or food_name in db_food:
            return macros
            
    # Default fallback (conservative estimate for unknown food)
    return {"calories": 100, "protein": 5, "carbs": 15, "fat": 5, "is_estimate": True}
