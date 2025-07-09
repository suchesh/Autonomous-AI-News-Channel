import os
import feedparser
from dotenv import load_dotenv
from typing import List, Dict, TypedDict

from pydantic import BaseModel 
from langgraph.graph import StateGraph
from langchain.schema.runnable import RunnableLambda
from langchain_google_genai import ChatGoogleGenerativeAI
import google.generativeai as genai


# Response models
class NewsItem(BaseModel):
    title: str
    description: str
    category: str

class Headline(BaseModel):
    title: str


# === Load Environment Variables ===
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# === Gemini LLM Config ===
llm = ChatGoogleGenerativeAI(   
    model="gemini-2.0-flash-lite",  
    temperature=0.3,
    max_tokens=300,
)

# === RSS Feed URLs ===
hindu_feeds = {
    "entertainment": "https://www.thehindu.com/entertainment/feeder/default.rss",
    "sports": "https://www.thehindu.com/sport/feeder/default.rss",
    "business": "https://www.thehindu.com/business/feeder/default.rss",
    "technology": "https://www.thehindu.com/sci-tech/technology/feeder/default.rss"
}

# === LangGraph State Schema ===
class NewsState(TypedDict):
    headlines: Dict[str, List[Headline]]
    news_items: List[NewsItem]

# === Helper: Fetch and Summarize ===
def fetch_and_summarize(url: str, category: str, limit: int = 4, summary_length: int = 200, as_headline=False):
    feed = feedparser.parse(url)
    results = []

    for entry in feed.entries[:limit]:
        title = entry.title.strip()
        summary = entry.summary.strip() if hasattr(entry, 'summary') else ""

        prompt = f"""You are a professional real-time news editor for a global breaking news channel.

                    Given the following article, write:
                    1. A punchy, attention-grabbing headline that mimics the tone of live TV breaking news.
                    2. A single-line summary that conveys the essence of the article, strictly within {summary_length} characters.

                    Guidelines:
                    - Do not include any labels, headings, or explanations in your output.
                    - Start with the headline, followed immediately by the one-line summary on a new line.
                    - Your tone should reflect urgency, clarity, and journalistic precision — as seen in real-time news tickers.
                    - Avoid filler words or unnecessary context. Get straight to the point.

                    Input Article:
                    Title: {title}
                    Content: {summary}

                    Output:
                    """


        try:
            llm_response = llm.invoke(prompt).content.strip()
        except Exception:
            llm_response = summary[:summary_length] + "..."

        if as_headline:
            results.append(Headline(title=llm_response))
        else:
            results.append(NewsItem(
                title=title,
                description=llm_response,
                category=category.capitalize()
            ))
    return results

# === Agents ===
def entertainment_agent(state: NewsState) -> NewsState:
    headlines = fetch_and_summarize(hindu_feeds["entertainment"], "entertainment", as_headline=True)
    state["headlines"]["entertainment"] = headlines
    return state

def sports_agent(state: NewsState) -> NewsState:
    headlines = fetch_and_summarize(hindu_feeds["sports"], "sports", as_headline=True)
    state["headlines"]["sports"] = headlines
    return state

def business_agent(state: NewsState) -> NewsState:
    news = fetch_and_summarize(hindu_feeds["business"], "business", as_headline=False)
    state["news_items"].extend(news)
    return state

def technology_agent(state: NewsState) -> NewsState:
    news = fetch_and_summarize(hindu_feeds["technology"], "technology", as_headline=False)
    state["news_items"].extend(news)
    return state

def merge_agent(state: NewsState) -> NewsState:
    return state

# === Build LangGraph ===
builder = StateGraph(NewsState)

builder.add_node("entertainment", RunnableLambda(entertainment_agent))
builder.add_node("sports", RunnableLambda(sports_agent))
builder.add_node("business", RunnableLambda(business_agent))
builder.add_node("technology", RunnableLambda(technology_agent))
builder.add_node("merge", RunnableLambda(merge_agent))

builder.set_entry_point("entertainment")
builder.add_edge("entertainment", "sports")
builder.add_edge("sports", "business")
builder.add_edge("business", "technology")
builder.add_edge("technology", "merge")

graph = builder.compile()

# === Run & Output ===
def gather_news_data() -> dict:
    initial_state: NewsState = {
        "headlines": {},
        "news_items": []
    }
    result: NewsState = graph.invoke(initial_state)
    return result

