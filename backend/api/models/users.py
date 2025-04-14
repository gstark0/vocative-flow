from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from .managers import CustomUserManager

class User(AbstractBaseUser, PermissionsMixin):
    """
    Single User model with a role field to differentiate between Admin, Creator, and Client.
    """
    ADMIN = 'admin'
    CREATOR = 'creator'
    CLIENT = 'client'
    
    ROLE_CHOICES = [
        (ADMIN, 'Admin'),
        (CREATOR, 'Creator'),
        (CLIENT, 'Client'),
    ]

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=CLIENT)  # Role field to define user type
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    @property
    def is_admin(self):
        return self.role == self.ADMIN

    @property
    def is_creator(self):
        return self.role == self.CREATOR

    @property
    def is_client(self):
        return self.role == self.CLIENT