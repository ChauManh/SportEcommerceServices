import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

response = openai.FineTuningJob.create(
    training_file="file-5zEbE8vnuqWT7ojdwKsjbR", #Sau khi chạy upload.py sẽ có file_id, truyền id vào đây
    model = "gpt-3.5-turbo",
)

print(response)
