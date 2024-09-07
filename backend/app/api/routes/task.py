from fastapi import APIRouter, Depends, HTTPException
from fastapi import status, Request
from fastapi.responses import HTMLResponse
from fastapi.security import OAuth2PasswordRequestForm


router = APIRouter()