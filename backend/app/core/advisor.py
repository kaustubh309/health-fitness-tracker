from app.schemas import schemas

def get_advice(user: schemas.User) -> dict:
    advice = {
        "exercise": "Please update your profile to get personalized advice.",
        "nutrition": "Please update your profile to get personalized advice."
    }
    
    # Needs basic info
    if not (user.goal and user.weight and user.height and user.age and user.gender):
        return advice

    goal = user.goal.lower()
    conditions = user.medical_conditions.lower() if user.medical_conditions else ""
    experience = user.experience_level.lower() if user.experience_level else "beginner"
    current_diet = user.current_diet if user.current_diet else "standard"
    
    # --- 1. Calorie & Macro Calculation ---
    # Mifflin-St Jeor Equation
    # Men: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
    # Women: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
    if user.gender.lower() == "male":
        bmr = (10 * user.weight) + (6.25 * user.height) - (5 * user.age) + 5
    else:
        bmr = (10 * user.weight) + (6.25 * user.height) - (5 * user.age) - 161
        
    # Activity Level - assume Moderate (1.55) as baseline for someone asking for a plan
    tdee = bmr * 1.55
    
    # Goal Adjustment
    if "lose" in goal or "weight loss" in goal:
        target_calories = tdee - 500
        goal_text = "Lose Weight (Calorie Deficit)"
    elif "gain" in goal or "muscle" in goal:
        target_calories = tdee + 400
        goal_text = "Gain Muscle (Calorie Surplus)"
    else:
        target_calories = tdee
        goal_text = "Maintain Weight"
        
    # Macro Split
    # Protein: ~2g per kg of bodyweight
    protein_g = user.weight * 2.0
    protein_cal = protein_g * 4
    
    # Fat: ~0.9g per kg of bodyweight
    fat_g = user.weight * 0.9
    fat_cal = fat_g * 9
    
    # Carbs: Remaining calories
    remaining_cal = target_calories - (protein_cal + fat_cal)
    carbs_g = max(0, remaining_cal / 4)
    
    # --- 2. Construct Diet Plan ---
    diet_plan = f"**Daily Calorie Target:** {int(target_calories)} kcal\n\n"
    diet_plan += f"**Macros:**\n"
    diet_plan += f"- Protein: {int(protein_g)}g\n"
    diet_plan += f"- Carbs: {int(carbs_g)}g\n"
    diet_plan += f"- Fats: {int(fat_g)}g\n\n"
    
    diet_plan += f"**Diet Strategy ({current_diet}):**\n"
    diet_plan += f"Since you follow a {current_diet} diet, focus on whole food sources that fit your preferences while hitting these macro targets.\n"
    diet_plan += f"Suggested Meal Frequency: 4-5 meals per day to optimize protein synthesis.\n"
    
    if "diabetes" in conditions:
        diet_plan += "\n**Note for Diabetes:** Prioritize complex carbs with low Glycemic Index and monitor blood sugar levels."
        
    advice["nutrition"] = diet_plan
    
    # --- 3. Construct Workout Plan ---
    workout_plan = f"**Experience Level:** {experience.capitalize()}\n"
    workout_plan += f"**Goal:** {goal_text}\n\n"
    
    if experience == "beginner" or "less" in experience or "1 year" in experience:
        split = "3-Day Full Body Split"
        details = (
            "- Day 1: Full Body A (Squat focus)\n"
            "- Day 2: Rest or Light Cardio\n"
            "- Day 3: Full Body B (Deadlift focus)\n"
            "- Day 4: Rest\n"
            "- Day 5: Full Body C (Bench/Overhead Press focus)\n"
            "- Weekend: Rest or Active Recovery"
        )
    elif experience == "intermediate" or "2 year" in experience:
        split = "4-Day Upper/Lower Split"
        details = (
            "- Day 1: Upper Power (Heavy Compounds)\n"
            "- Day 2: Lower Power (Squat/Deadlift)\n"
            "- Day 3: Rest\n"
            "- Day 4: Upper Hypertrophy (Higher Reps)\n"
            "- Day 5: Lower Hypertrophy\n"
            "- Weekend: Rest or Cardo"
        )
    else: # Advanced
        split = "6-Day Push/Pull/Legs (PPL)"
        details = (
            "- Day 1: Push (Chest/Shoulders/Triceps)\n"
            "- Day 2: Pull (Back/Biceps)\n"
            "- Day 3: Legs (Quads/Hams/Calves)\n"
            "- Day 4: Push (Hypertrophy focus)\n"
            "- Day 5: Pull (Hypertrophy focus)\n"
            "- Day 6: Legs (Hypertrophy focus)\n"
            "- Day 7: Rest"
        )
        
    workout_plan += f"**Recommended Split:** {split}\n\n"
    workout_plan += f"**Schedule:**\n{details}\n\n"
    
    if "joint" in conditions or "injury" in conditions:
        workout_plan += "**Safety Note:** Please stick to low-impact variations and consult a physio for specific exercises to avoid."

    advice["exercise"] = workout_plan

    return advice
