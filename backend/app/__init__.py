from flask import Flask
from .config import Config
from .extensions import cors, jwt
from .routes import home_bp, auth_bp, item_listing_bp, upload_bp

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(Config)

    # setup extensions
    cors.init_app(app)
    jwt.init_app(app)

    # register blueprints
    app.register_blueprint(home_bp)
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(item_listing_bp, url_prefix='/item-listing')
    app.register_blueprint(upload_bp, url_prefix='/api')

    return app
