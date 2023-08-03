import streamlit as st
import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore

from Website.newsScraping import fetch_analyse_sentiment
import plotly.graph_objects as go

cred = credentials.Certificate("C:\\Users\\User\\Desktop\\StockSense\\confidential\\admin.json")
firebase_admin.initialize_app(cred, name="StockSense")

def main():

    db = firestore.client()
    
    sidebar = st.sidebar.radio(options=["Home Page", "News", "Forecasting"], label="Sidebar", )
    
    if sidebar == "Home Page":
        st.title("StockSense 💰- Home")
        inputTicker = st.text_input("Enter a Stock Ticker").upper()
        if inputTicker:
            try:
                doc = db.collection("stock_prices_data").where("ticker", "==", str(inputTicker)).get()[0].to_dict()
            except Exception as e:
                st.write(e)
                st.write("Invalid or unsupported ticker. Try other Tickers!")
            name = doc["name"]
            df = pd.DataFrame(doc["prices"]).T
            df = df[["open", "close", "high", "low", "volume"]]
            st.write(df.describe())

            col1, col2 = st.columns(2)
            
            col1.subheader("Market Open Price:")
            col1.subheader(df["open"][-1])
            col1.write(df.index[-1])

            col2.subheader("Market Close Price:")
            col2.subheader(df["close"][-1])

            # Create a candlestick chart using Plotly
            fig = go.Figure(data=[go.Candlestick(x=df.index,
                                            open=df['open'],
                                            high=df['high'],
                                            low=df['low'],
                                            close=df['close'])])
            st.plotly_chart(fig)
        else:
            st.write("For example: GOOGL (Google), TSLA (Tesla) and AAPL (Apple).")

    elif sidebar == "News":
        st.title("StockSense 💰- News")
        name = st.text_input("Name of a company")
        if name:
            st.subheader(f"Some trending news about {name.capitalize()}.")
            for news in fetch_analyse_sentiment(name):
                st.write(news)

    elif sidebar == "Forecasting":
        st.title("StockSense 💰- Forecasting")

if __name__ == "__main__":
    main()