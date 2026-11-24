import os
import requests

SERPAPI_URL = "https://serpapi.com/search.json"

TARGET_STORES = [
    "amazon",
    "flipkart",
    "croma",
    "reliance digital",
]


def get_price_comparison(product):

    api_key = os.getenv("SERPAPI_API_KEY")

    if not api_key:
        raise ValueError("SerpApi API key is missing")

    query = f"{product.brand} {product.name}".strip()

    params = {
        "engine": "google_shopping",
        "q": query,
        "gl": "in",
        "hl": "en",
        "location": "India",
        "api_key": api_key,
    }

    response = requests.get(
        SERPAPI_URL,
        params=params,
        timeout=20
    )

    response.raise_for_status()

    data = response.json()

    shopping_results = data.get("shopping_results", [])

    results = []

    for item in shopping_results:

        store = item.get("source", "").strip()
        store_lower = store.lower()

        if not any(
            target in store_lower
            for target in TARGET_STORES
        ):
            continue

        price = item.get("extracted_price")

        if price is None:
            continue

        results.append({
            "store": store,
            "title": item.get("title"),
            "price": price,
            "image": item.get("thumbnail"),
            "link": item.get("product_link"),
        })

    results.sort(key=lambda x: x["price"])

    return results
