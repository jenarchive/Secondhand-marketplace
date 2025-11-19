from flask import Flask
from .config import Config
from .extensions import cors, jwt
from .routes import home_bp, auth_bp, item_listing_bp

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(Config)

    cors.init_app(app)
    jwt.init_app(app)

    app.register_blueprint(home_bp)
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(item_listing_bp, url_prefix='/item-listing')
    
    return app