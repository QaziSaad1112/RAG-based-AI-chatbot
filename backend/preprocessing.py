def clean_data(df):
    cleaned_df = df.copy()
    cleaned_df['question'] = cleaned_df['question'].fillna('')
    cleaned_df = cleaned_df.drop_duplicates()
    return cleaned_df

