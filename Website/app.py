from flask import Flask, render_template, redirect, url_for, jsonify, request
app = Flask(__name__, template_folder="pages", static_folder="assets")
from firebase_admin import credentials, firestore
import firebase_admin
import pandas as pd
from Forecasting.forecast import forecast
from News.newsScraping import fetch_analyse_sentiment

def initFirebase():
    cred = credentials.Certificate("../../Folders/confidential/admin.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("Successfully deployed Firebase.")
    return db

db = initFirebase()

# def fetch_stock_list():
#     stock_list = []
#     docs = db.collection("stock_data").get()
#     for doc in docs:
#         stock_list.append(doc.get("name"))
#     stock_list.insert(0, "")
#     print(stock_list)
#     return sorted(stock_list)

# stock_list = fetch_stock_list()

stock_list = ['', 'Apple', 'AbbVie', 'Airbnb', 'Abbott Laboratories', 'Accenture', 'Adobe', 'Advanced Micro Devices', 'Amgen', 'American Tower', 'Amazon.com', 'Broadcom', 'American Express', 'AstraZeneca', 'Boeing', 'Alibaba', 'Bank of America', 'BHP Group', 'Bank of Montreal', 'Bristol-Myers Squibb', 'British American Tobacco', 'Citigroup', 'Caterpillar', 'Comcast', 'Costco Wholesale', 'Salesforce', 'Cisco Systems', 'CSX', 'Chevron', 'Danaher', 'Walt Disney', 'Facebook', 'General Electric', 'Gilead Sciences', 'Google', 'Home Depot', 'HDFC Bank', 'Honeywell International', 'IBM', 'Intel', 'Johnson & Johnson', 'JPMorgan Chase', 'Coca-Cola', 'Linde', 'Eli Lilly and Company', 'Lockheed Martin', "Lowe's", 'Lam Research', 'Mastercard', "McDonald's", 'Medtronic', '3M', 'Altria Group', 'Merck & Co.', 'Microsoft', 'NextEra Energy', 'Netflix', 'Nike', 'NVIDIA', 'Oracle', 'Pinduoduo', 'PepsiCo', 'Pfizer', 'Procter & Gamble', 'Philip Morris', 'PayPal', 'Qualcomm', 'SAP SE', 'Starbucks', 'Shopify', 'Sanofi', 'AT&T', 'Target', 'Thermo Fisher Scientific', 'T-Mobile', 'Tesla', 'Taiwan Semiconductor', 'Texas Instruments', 'UnitedHealth Group', 'Union Pacific', 'United Parcel Service', 'Visa', 'Vertex Pharmaceuticals', 'Verizon Communications', 'Walgreens Boots Alliance', 'Wells Fargo', 'Walmart', 'Exxon Mobil']

activeTicker = None

@app.route('/')
def index():
    return redirect(url_for('dashboard'))

@app.route('/dashboard')
def dashboard():
    return render_template("dashboard.html")

@app.route('/my-stocks')
def my_stocks():
    return render_template("my-stocks.html")

@app.route('/news')
def news():
    return render_template('news.html')

@app.route('/stock_data')
def get_ticker():
    global activeTicker
    name = request.args.get("name")
    name = name.replace("%20", " ").replace("%26", "&")
    doc = db.collection("stock_data").where("name", "==", name).get()[0].to_dict()
    activeTicker = doc["prices"]
    return doc["prices"]

@app.route('/stock_list')
def send_stock_list():
    return stock_list

@app.route('/forecast_prices')
def forecasting():
    global activeTicker
    days = int(request.args.get("days"))
    df = pd.DataFrame(activeTicker).T.sort_index()["close"]
    forecastedText = forecast(df=df, future_days=days)
    return jsonify(forecastedText)

@app.route('/fetch_news')
def news_fetch():
    query = request.args.get("query").replace("%20", " ")
    resultLst = fetch_analyse_sentiment(query)
    return resultLst

if __name__ == '__main__':
    app.run(debug=True)
