from datetime import datetime
from typing import List, Optional
from app.models.notification import notification
from app.models.user import User
from beanie.operators import Eq
from app.config import settings

notificationMessage  = settings.notificationMessage
class notificationService:
 
    @staticmethod
    async def delete_notification(notification_id: str):
        return await notification.delete(notification_id)
    
    @staticmethod
    async def create_notification( message: str) -> notification:
        notif = notification(
            message=message,
            created_at=datetime.utcnow() 
        )
        await notif.insert()
        return notif
    
    @staticmethod
    async def get_notifications(user: User) -> List[notification]:
        notifications = await notification.find_many(
         {
            "$and": [
                Eq(notification.user_id.id, user.id),  # Use the user's ID
                Eq(notification.issent, False)
            ]
          }
         ).sort("-created_at").to_list()
    
        print(notifications)
    
        for notif in notifications:
           notif.issent = True
           await notif.save()
        
        return notifications
    
    @staticmethod
    async def get_all_notifications() -> List[notification]:
        return await notification.find_all().sort("-created_at").to_list()