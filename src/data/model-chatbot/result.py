import openai
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

response = openai.FineTuningJob.retrieve("ftjob-3proF6uXbu1o0SIfqxz9SK0K") # ID của job fine-tuning cần lấy thông tin
print(response)
# Lấy ra trường fine_tuned_model trong response
