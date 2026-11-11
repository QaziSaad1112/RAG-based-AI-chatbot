import pandas as pd

file_path = "C:\\Users\\PC\\Desktop\\chat_bot\\data\\syedshayan_dataset_final.csv"

def load_data(file_path):
    """
    Load data from a CSV file.

    Args:
        file_path (str): The path to the CSV file.
    """
    data = pd.read_csv(file_path)
    return data
