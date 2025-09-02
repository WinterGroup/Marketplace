from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from daos.confirmation_dao import getConfirmationDAO
from daos.sender_dao import SenderDAO
from models.confirmation_model import ConfirmationModel
from typing import Optional
from random import randint
from datetime import datetime, timedelta

router = APIRouter(prefix="/confirm")

@router.post("")
async def confirm(
        code: str,
        username: str,
        service: getConfirmationDAO = Depends(),
    ) -> Optional[bool]:

    item = await service.get(f"conf {username}")
    
    if item:
        if item.expiration < datetime.now():
            await service.delete(f"conf {username}")
            raise HTTPException(
                status_code=400,
                detail="Activation Code Expired"
            )

        if item.link == code:
            await service.delete(f"conf {username}")
            return True

        return False

    return None

@router.post("/create")
async def create(
        username: str,
        email: str,
        tasks: BackgroundTasks,
        service: getConfirmationDAO = Depends(),
    ) -> bool:

    model = ConfirmationModel(
        link=str(randint(100000,999999)),
        username=username, 
        email=email,
        expiration=datetime.now()+timedelta(hours=2)
    )
    
    sender = SenderDAO(
        "MarketplaceOfficial@mail.ru",
        email,
        "Activation Code",
        f"Your activation code is {model.link}"
    )

    tasks.add_task(sender.send)

    await service.create(model)
    return True
