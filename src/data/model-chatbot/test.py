import openai
import os
from dotenv import load_dotenv
load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

# Gọi mô hình đã được fine-tune
response = openai.ChatCompletion.create(
  model="ft:gpt-3.5-turbo-0125:personal:my-finetuned-model-v2:BQaGGQs4",  # Mô hình đã được fine-tune
  messages=[
        {"role": "system", "content": "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."},
        {"role": "user", "content": "Chính sách đổi trả sản phẩm của cửa hàng là gì?"}
    ]
)

print(response.choices[0].message['content'])
