from bs4 import BeautifulSoup
import requests
import pickle

headers = {'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246"}

def latest_5_news(company_name):
    url = f"https://economictimes.indiatimes.com/topic/{company_name}"
    response = requests.get(url=url, headers=headers)

    output = []
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, "html.parser")
        for i, news in enumerate(soup.find_all("div", class_="contentD")):
            if i > 4:
                break
            headline = news.text[:-26]
            date = news.text[-26:]
            # output.append(f"{i+1}. {headline}. \n Dated: {date}\n\n")

            data = {
                "headline" : headline, 
                "date" :date
            }

            output.append(data)
    else:
        print("Failed to get the page", response.status_code)
    return output

with open("News/SentimentModel/newsSentiment.pkl", "rb") as file:
    model = pickle.load(file)

with open("News/SentimentModel/vectorizer.pkl", "rb") as file:
    vectorizer = pickle.load(file)

def sentiment(text):
    textData = vectorizer.transform([text])
    if model.predict(textData) == 0:
        return "Negative 🔴"
    else:
        return "Positive 🟢"

def fetch_analyse_sentiment(name):
    news = latest_5_news(name)
    output = []

    for head in news:
        if head:
            head["sentiment"] = sentiment(head["headline"])
            output.append(head)
    return output