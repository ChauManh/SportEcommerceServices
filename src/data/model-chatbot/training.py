import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

response = openai.FineTuningJob.create(
    training_file="file-P9eL4DWd9HZptmy5Jj4hpB", #Sau khi chạy upload.py sẽ có file_id, truyền id vào đây
    model = "ft:gpt-3.5-turbo-0125:personal::BQCTOs0k",
    hyperparameters={
            "n_epochs": 4,
        },
    suffix="my-finetuned-model-v2" 
)

print(response)
