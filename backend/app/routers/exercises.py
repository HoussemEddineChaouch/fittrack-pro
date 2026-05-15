from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse, RedirectResponse
import httpx
from ..auth import get_current_user
from ..models import User

router = APIRouter(prefix="/api/exercises", tags=["exercises"])

API_BASE = "https://api.workoutxapp.com/v1/exercises"
API_KEY = "wx_bad80c1367fd431edd9254744b90ca7c80b2a6a7256b90ff5bdb1c95"
HEADERS = {"X-WorkoutX-Key": API_KEY}

def normalize(ex: dict) -> dict:
    gif_url = ex.get("gifUrl", "")
    gif_id = gif_url.split("/")[-1] if gif_url else ""
    return {
        "id": ex.get("id", ""),
        "name": ex.get("name", "Unknown").title(),
        "muscle": ex.get("target", "General").title(),
        "equipment": ex.get("equipment", "Body weight").title(),
        "category": ex.get("bodyPart", "General").title(),
        "difficulty": ex.get("difficulty", "Intermediate").title(),
        "image": f"/api/exercises/gif/{gif_id}" if gif_id else "",
        "instructions": ex.get("instructions", []),
        "secondaryMuscles": ex.get("secondaryMuscles", []),
    }

# ── GIF proxy — NO auth (img tags can't send headers) ──
@router.get("/gif/{gif_id}")
async def proxy_gif(gif_id: str):
    gif_url = f"https://api.workoutxapp.com/v1/gifs/{gif_id}"
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            res = await client.get(gif_url, headers=HEADERS)
            print(f"GIF proxy: {gif_id} → {res.status_code}")
            if res.status_code == 200:
                return StreamingResponse(
                    iter([res.content]),
                    media_type="image/gif",
                    headers={"Cache-Control": "public, max-age=86400"}
                )
            print(f"GIF error body: {res.text}")
    except Exception as e:
        print(f"GIF exception: {e}")
    return RedirectResponse("https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400")

# ── Body parts list ──
@router.get("/bodyparts")
async def get_body_parts(current_user: User = Depends(get_current_user)):
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.get(f"{API_BASE}/bodyPartList", headers=HEADERS)
            if res.status_code == 200:
                return res.json()
    except Exception:
        pass
    return ["back","cardio","chest","lower arms","lower legs","shoulders","upper arms","upper legs","waist"]

# ── Main exercises list ──
@router.get("")
@router.get("/")
async def get_exercises(
    bodyPart: str = None,
    search: str = None,
    limit: int = 10,
    offset: int = 0,
    current_user: User = Depends(get_current_user)
):
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            if search:
                url = f"{API_BASE}/name/{search}"
                res = await client.get(url, headers=HEADERS)
            elif bodyPart and bodyPart.lower() != "all":
                url = f"{API_BASE}/bodyPart/{bodyPart.lower()}"
                res = await client.get(url, headers=HEADERS, params={"limit": limit, "offset": offset})
            else:
                res = await client.get(API_BASE, headers=HEADERS, params={"limit": limit, "offset": offset})

            print(f"API Status: {res.status_code} | URL: {res.url}")

            if res.status_code == 200:
                data = res.json()
                exercises = data if isinstance(data, list) else data.get("data", [])
                return [normalize(ex) for ex in exercises]
            else:
                print(f"API Error: {res.text}")

    except Exception as e:
        print(f"Exception: {e}")

    return get_fallback_exercises()

def get_fallback_exercises():
    return [
        {"id":"0009","name":"Barbell Bench Press","muscle":"Pectorals","equipment":"Barbell","category":"Chest","difficulty":"Intermediate","image":"https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400","instructions":[],"secondaryMuscles":[]},
        {"id":"0023","name":"Barbell Curl","muscle":"Biceps","equipment":"Barbell","category":"Upper Arms","difficulty":"Beginner","image":"https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400","instructions":[],"secondaryMuscles":[]},
        {"id":"0032","name":"Barbell Deadlift","muscle":"Glutes","equipment":"Barbell","category":"Upper Legs","difficulty":"Advanced","image":"https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400","instructions":[],"secondaryMuscles":[]},
        {"id":"0201","name":"Barbell Squat","muscle":"Quads","equipment":"Barbell","category":"Upper Legs","difficulty":"Intermediate","image":"https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=400","instructions":[],"secondaryMuscles":[]},
        {"id":"0042","name":"Dumbbell Bicep Curl","muscle":"Biceps","equipment":"Dumbbell","category":"Upper Arms","difficulty":"Beginner","image":"https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400","instructions":[],"secondaryMuscles":[]},
        {"id":"0088","name":"Pull Up","muscle":"Lats","equipment":"Body Weight","category":"Back","difficulty":"Advanced","image":"https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=400","instructions":[],"secondaryMuscles":[]},
        {"id":"0055","name":"Plank","muscle":"Abs","equipment":"Body Weight","category":"Waist","difficulty":"Beginner","image":"https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=400","instructions":[],"secondaryMuscles":[]},
        {"id":"0071","name":"Treadmill Run","muscle":"Cardiovascular System","equipment":"Treadmill","category":"Cardio","difficulty":"Beginner","image":"https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400","instructions":[],"secondaryMuscles":[]},
        {"id":"0099","name":"Dumbbell Shoulder Press","muscle":"Delts","equipment":"Dumbbell","category":"Shoulders","difficulty":"Beginner","image":"https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400","instructions":[],"secondaryMuscles":[]},
        {"id":"0110","name":"Tricep Dips","muscle":"Triceps","equipment":"Body Weight","category":"Upper Arms","difficulty":"Intermediate","image":"https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=400","instructions":[],"secondaryMuscles":[]},
    ]