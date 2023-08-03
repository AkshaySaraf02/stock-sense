import pandas as pd
import numpy as np
import pickle
from sklearn.preprocessing import MinMaxScaler
from tensorflow import keras

model_path = "C:\\Users\\User\\Desktop\\StockSense\\Website\\Forecasting\\stock_forecast_model.h5"
model = keras.models.load_model(model_path)
scaler = MinMaxScaler()

def pre_processing(df):
    data = scaler.fit_transform(X=np.array(df).reshape(-1, 1))[-10:]
    data = np.reshape(data, newshape=(10, 1))
    return data
    
def predict(future_days, last_10):
    new_data = np.expand_dims(last_10, axis=0)   
    for i in range(10, future_days):
        preds = model.predict(new_data[:, i-10:i, :], verbose=0)  # Predict using the last 10 days
        new_data = np.append(new_data, np.expand_dims(preds, 0), axis=1)
    return new_data

def forecast(df, future_days=1):
    processed_data = pre_processing(df)
    predictions = predict(10+int(future_days), processed_data)
    predictions = scaler.inverse_transform(predictions.reshape(10+int(future_days),1))
    
    return f"{round(predictions[10+int(future_days)-1][0], 2)} USD"
