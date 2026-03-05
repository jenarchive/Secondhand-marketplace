from flask import Blueprint

item_listing_bp = Blueprint("listing", __name__)

@item_listing_bp.get("/")
def list_item():
    return "Item listing page"
