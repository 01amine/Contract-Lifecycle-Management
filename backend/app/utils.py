from fastapi import HTTPException, UploadFile, status
from passlib.context import CryptContext
from fastapi import BackgroundTasks
from fastapi_mail import FastMail, MessageSchema
from app.config import settings, conf


class PasswordsUtils:
    pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")


def check_extension(
    file: UploadFile, ext_content_type_map: dict[str, list[str]]
) -> str:
    
    allowed_extensions = list(ext_content_type_map.keys())
    if file.filename is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image should have a filename",
        )

    filename_splitted = file.filename.split(".")

    if len(filename_splitted) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image filename should have an extension",
        )

    file_ext = filename_splitted[-1]

    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image filename extension should be one of: "
            + ", ".join(allowed_extensions),
        )

    if file.content_type not in ext_content_type_map[file_ext]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid content type, got: {file.content_type}, expected: {ext_content_type_map[file_ext]}",
        )

    return file_ext


async def send_email(email: str, code: str, background_tasks: BackgroundTasks) -> None:
    """
    Sends a password reset email with a 4-digit code in French.
    """
    # Email content in HTML format, now in French.
    html_content = f"""
    <p>Bonjour,</p>
    <p>Vous avez demandé une réinitialisation de votre mot de passe. Utilisez le code ci-dessous pour le réinitialiser :</p>
    <h3>{code}</h3>
    <p>Ce code est valide pendant {settings.PASSWORD_RESET_TOKEN_EXPIRES // 60} minutes.</p>
    <p>Si vous n'avez pas demandé de réinitialisation de mot de passe, vous pouvez ignorer cet e-mail en toute sécurité.</p>
    """

    message = MessageSchema(
        subject="Demande de réinitialisation de mot de passe",
        recipients=[email],
        body=html_content,
        subtype="html"
    )

    fm = FastMail(conf)
    background_tasks.add_task(fm.send_message, message)