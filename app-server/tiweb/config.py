class DefaultConfig(object):
    DEBUG = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = "mysql+mysqlconnector://cybexpadmin:cybexp19sekret@134.197.21.10:3306/cybexpui"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    PROPOGATE_EXCCEPTIONS = True
    WTF_CSRF_ENABLED = False

    CONTAINER_CLUSTERIP = "moose.soc.unr.edu"
    CONTAINER_URLBASE = "https://squirrel.soc.unr.edu/v3/"
    CONTAINER_CLUSTERID = "c-cfhkn"
    CONTAINER_PROJECTID = "c-cfhkn:p-8j84j"
    CONTAINER_BEARER = "Bearer token-qvn5t:2hlxgjsgrd8p7kxtwmm2s6qwvcn5x6ccvvzlzs4prs6p2wvfbj2xmw"

    SECURITY_PASSWORD_HASH = 'sha512_crypt'
    SECURITY_PASSWORD_SALT = 'asfdkjasdf32cxvewfsda'
    
    SECRET_KEY = 'session secret key'

class ProdConfig(DefaultConfig):
    JWT_SECRET_KEY = "notsosecret"
    CONTAINER_TOKEN = "somecontainertoken"
    PROPOGATE_EXCCEPTIONS = False

    TEST = 'test_prod_string'

     # Flask-Mail SMTP server settings
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465
    MAIL_USE_SSL = True
    MAIL_USE_TLS = False
    MAIL_USERNAME = 'email@example.com'
    MAIL_PASSWORD = 'password'
    MAIL_DEFAULT_SENDER = '"MyApp" <noreply@example.com>'

    # Flask-User settings
    USER_APP_NAME = "Flask-User Basic App"      # Shown in and email templates and page footers
    USER_ENABLE_EMAIL = False        # Enable email authentication
    USER_ENABLE_USERNAME = False    # Disable username authentication
    USER_EMAIL_SENDER_NAME = USER_APP_NAME
    USER_EMAIL_SENDER_EMAIL = "noreply@example.com"

class DevConfig(DefaultConfig):
    DEBUG = True
    JWT_SECRET_KEY = "notsosecret"
    CONTAINER_TOKEN = "Bearer token-h88mk:snmxx9hxdqgg9gpk7blrrhxz899rb9k884tc74dllb28m628srxtfq"
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    BOLT_IP = '127.0.0.1'
    BOLT_PORT = '39530'
    BOLT_AUTH_USER = 'neo4j'
    BOLT_AUTH_P = 'KLZPXA9k9uv5654'
    LOGIN_DISABLED = True
    TEST = 'test_dev_string'
         # Flask-Mail SMTP server settings
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465
    MAIL_USE_SSL = True
    MAIL_USE_TLS = False
    MAIL_USERNAME = 'email@example.com'
    MAIL_PASSWORD = 'password'
    MAIL_DEFAULT_SENDER = '"MyApp" <noreply@example.com>'

    # Flask-User settings
    USER_APP_NAME = "Flask-User Basic App"      # Shown in and email templates and page footers
    USER_ENABLE_EMAIL = False        # Enable email authentication
    USER_ENABLE_USERNAME = False    # Disable username authentication
    USER_EMAIL_SENDER_NAME = USER_APP_NAME
    USER_EMAIL_SENDER_EMAIL = "noreply@example.com"
