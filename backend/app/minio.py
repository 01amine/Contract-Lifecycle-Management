import random
import string
import uuid
from fastapi import UploadFile
from miniopy_async.error import S3Error  # type: ignore
from miniopy_async.api import Minio  # type: ignore

from app.utils import check_extension
from app import exceptions
import unicodedata
import re

def sanitize_filename(filename: str) -> str:
    name = unicodedata.normalize("NFKD", filename)
    name = name.encode("ascii", "ignore").decode("ascii")
    name = re.sub(r"[^A-Za-z0-9._-]", "_", name)
    return name or "file"


IMAGES_BUCKET_NAME = "images"
DOCUMENTS_BUCKET_NAME = "documents"
WA_SIM_BUCKET_NAME = "wa-sim"

async def init_minio_client(
    minio_host: str, minio_port: int, minio_root_user: str, minio_root_password: str
):
    endpoint = f"{minio_host}:{minio_port}"

    Bucket.client = Minio(
        endpoint,
        access_key=minio_root_user,
        secret_key=minio_root_password,
        secure=False,        # still correct since MinIO uses HTTP inside Docker
        region="us-east-1",  # optional but safe
    )


    for bucket_name in [IMAGES_BUCKET_NAME, DOCUMENTS_BUCKET_NAME, WA_SIM_BUCKET_NAME]:
        print("Connecting to MinIO at", endpoint)
        print("Checking bucket:", bucket_name)  
        if not await Bucket.client.bucket_exists(bucket_name):
            await Bucket.client.make_bucket(bucket_name)

class Bucket:
    bucket_name: str
    file_prefix: str
    client: Minio

    def __init__(self, bucket_name: str, file_prefix: str):
        self.bucket_name = bucket_name
        self.file_prefix = file_prefix

    async def put(self, file: UploadFile, object_name: str | None = None) -> str:
        if object_name is None:
            object_name = str(uuid.uuid4())

        if file.content_type is None:
            file.content_type = "application/octet-stream"

        if file.filename is None:
            file.filename = object_name

        await self.client.put_object(
            bucket_name=self.bucket_name,
            object_name=f"{self.file_prefix}/{object_name}",
            data=file.file,
            length=-1,
            part_size=10 * 1024 * 1024,
            content_type=file.content_type,
            metadata={
             "filename": sanitize_filename(file.filename or object_name),
            },
        )
        return object_name

    async def get(self, object_name: str) -> tuple[bytes, str, str]:
        try:
            res = await self.client.get_object(
                bucket_name=self.bucket_name,
                object_name=f"{self.file_prefix}/{object_name}",
            )
        except S3Error as e:
            if e.code == "NoSuchKey":
                raise exceptions.NotFound
            else:
                raise e

        data = await res.read()
        content_type = (
            res.content_type if res.content_type else "application/octet-stream"
        )
        filename = res.headers.get("x-amz-meta-filename", f"{object_name}")

        res.close()
        return (data, filename, content_type)

    async def delete(self, object_name: str) -> None:
        await self.client.remove_object(
            bucket_name=self.bucket_name,
            object_name=f"{self.file_prefix}/{object_name}",
        )

image_ext_content_type_map = {
    "apng": ["image/apng"],
    "avif": ["image/avif"],
    "gif": ["image/gif"],
    "jpeg": ["image/jpeg"],
    "jpg": ["image/jpeg"],
    "png": ["image/png", "image/x-citrix-png"],
    "svg": ["image/svg+xml"],
    "webp": ["image/webp"],
    "ico": ["image/x-icon", "image/vnd.microsoft.icon"],
}

class ImageBucket(Bucket):
    def __init__(self, file_prefix: str):
        super().__init__(IMAGES_BUCKET_NAME, file_prefix)

    async def put(self, file: UploadFile, object_name: str | None = None) -> str:
        check_extension(file, image_ext_content_type_map)
        return await super().put(file, object_name)

class DocumentBucket(Bucket):
    def __init__(self, file_prefix: str):
        super().__init__(DOCUMENTS_BUCKET_NAME, file_prefix)

class WaSimBucket(Bucket):
    def __init__(self):
        super().__init__(WA_SIM_BUCKET_NAME, "")

    async def put(self, file: UploadFile, object_name: str | None = None) -> str:
        if object_name is None:
            object_name = "".join(random.choice(string.digits) for _ in range(16))
        return await super().put(file, object_name)
