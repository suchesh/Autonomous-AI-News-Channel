from fastapi import FastAPI
from typing import List
from gather_news import gather_news_data
from gather_news import NewsItem, Headline
# ✅ Now you're safe to import gather_news if needed

app = FastAPI()



# ✅ Fetch once per startup or use caching
news_data = gather_news_data()

@app.get("/news/left", response_model=List[NewsItem])
def get_left_news():
    return [item for item in news_data["news_items"] if item.category.lower() == "technology"]

@app.get("/news/right", response_model=List[NewsItem])
def get_right_news():
    return [item for item in news_data["news_items"] if item.category.lower() == "business"]

@app.get("/news/top", response_model=List[Headline])
def get_top_headlines():
    return news_data["headlines"].get("entertainment", [])

@app.get("/news/bottom", response_model=List[Headline])
def get_bottom_titles():
    return news_data["headlines"].get("sports", [])
