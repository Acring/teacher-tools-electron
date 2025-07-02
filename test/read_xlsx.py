
import pandas as pd
import json

# Read the Excel file
df = pd.read_excel('zongce.xlsx')

# Convert the DataFrame to a JSON string
json_output = df.to_json(orient='records', force_ascii=False)

# Print the JSON output
print(json_output)
