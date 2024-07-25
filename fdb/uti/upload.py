from datetime import timedelta
from fdb.firestore_config import bucket
import asyncio
from functools import lru_cache

@lru_cache(maxsize=4)
def upload_file(file_path, destination_path):

    # Tải lên file từ đường dẫn cục bộ lên Firebase Storage
    blob = bucket.blob(destination_path)
    blob.upload_from_filename(file_path)

    # Lấy URL của file từ Firebase Storage
    url = blob.generate_signed_url(
        version='v4',
        expiration=timedelta(days=7),  # Thời gian URL hết hạn sau 7 ngày
        method='GET'
    )

    return url

async def asyn_upload_file(file_path, destination_path):
    loop = asyncio.get_running_loop()
    url = await loop.run_in_executor(None, upload_file, file_path, destination_path)
    return url

async def upload_files(files):
    tasks = []
    for file_path, destination_path in files:
        task = asyncio.create_task(asyn_upload_file(file_path, destination_path))
        tasks.append(task)

    urls = await asyncio.gather(*tasks)
    return urls