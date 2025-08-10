from .base import *
import dj_database_url
from dotenv import load_dotenv

load_dotenv()

DEBUG = True

SESSION_COOKIE_SAMESITE = 'None'
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SAMESITE = 'None'
CSRF_COOKIE_SECURE = False


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT', '3306'),
    }
}
