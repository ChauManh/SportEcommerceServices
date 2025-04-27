import openai
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

response = openai.File.create(
  file=open("train.jsonl", "rb"), # Thay tên file ở đây bằng tên file của bạn .jsonl
  purpose='fine-tune'
)

print(response)
