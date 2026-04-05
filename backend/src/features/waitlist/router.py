from __future__ import annotations

import re

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, field_validator
from sqlalchemy.exc import IntegrityError

from src.core.dependencies import DbSession
from src.infra.db.models import WaitlistEntry

router = APIRouter(prefix="/api/v1/waitlist", tags=["waitlist"])

_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class WaitlistRequest(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = v.strip().lower()
        if not _EMAIL_RE.match(v):
            raise ValueError("Invalid email address.")
        return v


class WaitlistResponse(BaseModel):
    message: str


@router.post("", response_model=WaitlistResponse, status_code=201)
def join_waitlist(body: WaitlistRequest, db: DbSession) -> WaitlistResponse:
    """Register an email for the waitlist."""
    entry = WaitlistEntry(email=body.email)
    try:
        db.add(entry)
        db.commit()
    except IntegrityError:
        db.rollback()
        return WaitlistResponse(message="You're already on the list!")
    return WaitlistResponse(message="You've been added to the queue!")
