import json
import pickle
import numpy as np

__locations = None
__data_columns = None
__model = None

def get_location_names():
    """Returns a list of location names."""
    global __locations
    return __locations

def get_estimated_price(location, sqft, bhk, bath):
    """Predict the price of a house based on input parameters."""
    try:
        loc_index = __data_columns.index(location.lower())
    except ValueError:
        loc_index = -1

    x = np.zeros(len(__data_columns))
    x[0] = sqft
    x[1] = bath
    x[2] = bhk
    if loc_index >= 0:
        x[loc_index] = 1

    return round(__model.predict([x])[0], 2)

def load_saved_artifacts():
    """Loads the model and location data from files."""
    global __data_columns
    global __locations
    global __model

    # Load the column names (locations are part of data_columns)
    with open("./artifacts/columns.json", "r", encoding="utf-8") as f:
        __data_columns = json.load(f)["data_columns"]
        __locations = __data_columns[3:]  # Assuming first 3 are non-location columns

    # Load the trained model
    with open("./artifacts/banglore_home_prices_model.pickle", "rb") as f:
        __model = pickle.load(f)
