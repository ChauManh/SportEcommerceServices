import json
import tiktoken

encoder = tiktoken.get_encoding("cl100k_base")

def count_tokens_in_jsonl(file_path):
    total_tokens = 0
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            data = json.loads(line)

            for message in data['messages']:
                
                combined_text = f"{message['role']}: {message['content']}"
                tokens = encoder.encode(combined_text)
                total_tokens += len(tokens)
    return total_tokens

file_path = 'train.jsonl'
token_count = count_tokens_in_jsonl(file_path)
print(f"Total number of tokens: {token_count}")
