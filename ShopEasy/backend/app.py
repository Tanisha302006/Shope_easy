from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from functools import wraps
import json
import os

app = Flask(__name__)
# Enable CORS for the React frontend
CORS(app)

# SQLite Configuration - ZERO external server needed!
basedir = os.path.abspath(os.path.dirname(__name__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'shopeasy.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'super-secret-shopeasy-jwt-key'  # Change in production

db = SQLAlchemy(app)
jwt = JWTManager(app)

# ==================== MODELS ====================
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {"_id": self.id, "name": self.name, "email": self.email, "isAdmin": self.is_admin, "createdAt": self.created_at.isoformat() if self.created_at else None}

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    image = db.Column(db.String(500))
    description = db.Column(db.Text)
    category = db.Column(db.String(50))
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, default=0)
    rating = db.Column(db.Float, default=0.0)

    def to_dict(self):
        return {"_id": str(self.id), "name": self.name, "image": self.image, "description": self.description, "category": self.category, "price": self.price, "stock": self.stock, "rating": self.rating}

class CartItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    quantity = db.Column(db.Integer, default=1)
    
class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    items_json = db.Column(db.Text, nullable=False) # Store serialized items
    total_amount = db.Column(db.Float, nullable=False)
    shipping_address = db.Column(db.Text)
    status = db.Column(db.String(50), default='Processing')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ==================== ADMIN DECORATOR ====================
def admin_required(fn):
    """Decorator that checks if the current JWT user is an admin."""
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        if not user or not user.is_admin:
            return jsonify({"message": "Admin access required"}), 403
        return fn(*args, **kwargs)
    return wrapper


# ==================== AUTH ROUTES ====================
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({"message": "User already exists"}), 400
    
    hashed_pwd = generate_password_hash(data.get('password'))
    new_user = User(name=data.get('name'), email=data.get('email'), password_hash=hashed_pwd)
    db.session.add(new_user)
    db.session.commit()
    
    token = create_access_token(identity=str(new_user.id))
    user_data = new_user.to_dict()
    user_data['token'] = token
    return jsonify(user_data), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data.get('email')).first()
    
    if user and check_password_hash(user.password_hash, data.get('password')):
        token = create_access_token(identity=str(user.id))
        user_data = user.to_dict()
        user_data['token'] = token
        return jsonify(user_data), 200
    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify(user.to_dict()), 200

# ==================== PRODUCT ROUTES ====================
@app.route('/api/products', methods=['GET'])
def get_products():
    category = request.args.get('category')
    if category and category != 'undefined':
        products = Product.query.filter_by(category=category).all()
    else:
        products = Product.query.all()
    return jsonify([p.to_dict() for p in products]), 200

@app.route('/api/products/<int:id>', methods=['GET', 'DELETE'])
def handle_product(id):
    product = Product.query.get_or_404(id)
    if request.method == 'DELETE':
        db.session.delete(product)
        db.session.commit()
        return jsonify({"message": "Deleted"}), 200
    return jsonify(product.to_dict()), 200

# ==================== CART ROUTES ====================
@app.route('/api/cart', methods=['GET', 'POST'])
@jwt_required()
def handle_cart():
    user_id = get_jwt_identity()
    
    if request.method == 'POST':
        data = request.json
        product_id = data.get('productId')
        qty = data.get('quantity', 1)
        
        # Check if exists
        existing = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()
        if existing:
            existing.quantity += int(qty)
        else:
            new_item = CartItem(user_id=user_id, product_id=product_id, quantity=qty)
            db.session.add(new_item)
        db.session.commit()
        return jsonify({"message": "Added to cart"}), 201

    if request.method == 'GET':
        items = CartItem.query.filter_by(user_id=user_id).all()
        cart_data = []
        for item in items:
            prod = Product.query.get(item.product_id)
            if prod:
                cart_data.append({
                    "_id": item.product_id, 
                    "quantity": item.quantity, 
                    "product": prod.to_dict()
                })
        return jsonify({"items": cart_data}), 200

@app.route('/api/cart/<int:product_id>', methods=['DELETE', 'PUT'])
@jwt_required()
def mutate_cart_item(product_id):
    user_id = get_jwt_identity()
    item = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    if not item: return jsonify({"message": "Not found"}), 404
    
    if request.method == 'DELETE':
        db.session.delete(item)
    elif request.method == 'PUT':
        item.quantity = request.json.get('quantity', 1)
        
    db.session.commit()
    return jsonify({"message": "Updated"}), 200


# ==================== ORDER ROUTES ====================
@app.route('/api/orders', methods=['POST'])
@jwt_required()
def checkout():
    user_id = get_jwt_identity()
    address = request.json.get('shippingAddress', {})
    
    # Get user cart
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    if not cart_items:
        return jsonify({"message": "Cart empty"}), 400
        
    total = 0
    order_details = []
    
    for item in cart_items:
        p = Product.query.get(item.product_id)
        if p:
            total += (p.price * item.quantity)
            order_details.append({"name": p.name, "price": p.price, "quantity": item.quantity, "product": str(p.id)})
            p.stock -= item.quantity # decrement stock
            db.session.delete(item) # clear cart item
            
    new_order = Order(
        user_id=user_id, 
        items_json=json.dumps(order_details), 
        total_amount=total,
        shipping_address=json.dumps(address)
    )
    db.session.add(new_order)
    db.session.commit()
    
    return jsonify({"message": "Order Placed"}), 201

@app.route('/api/orders/myorders', methods=['GET'])
@jwt_required()
def my_orders():
    user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    result = []
    for o in orders:
        result.append({
            "_id": str(o.id),
            "totalAmount": o.total_amount,
            "orderStatus": o.status,
            "createdAt": o.created_at.isoformat(),
            "items": json.loads(o.items_json)
        })
    return jsonify(result), 200


# ==================== ADMIN ROUTES ====================

# --- Admin: Dashboard Statistics ---
@app.route('/api/admin/stats', methods=['GET'])
@admin_required
def admin_stats():
    total_products = Product.query.count()
    total_orders = Order.query.count()
    total_users = User.query.count()
    
    # Revenue
    orders = Order.query.all()
    total_revenue = sum(o.total_amount for o in orders)
    
    # Low stock count
    low_stock = Product.query.filter(Product.stock < 5).count()
    
    # Recent orders (last 5)
    recent_orders = Order.query.order_by(Order.created_at.desc()).limit(5).all()
    recent_orders_data = []
    for o in recent_orders:
        user = User.query.get(o.user_id)
        recent_orders_data.append({
            "_id": str(o.id),
            "totalAmount": o.total_amount,
            "orderStatus": o.status,
            "createdAt": o.created_at.isoformat(),
            "customerName": user.name if user else "Unknown",
            "customerEmail": user.email if user else "N/A",
            "items": json.loads(o.items_json)
        })
    
    # Orders by status
    processing_count = Order.query.filter_by(status='Processing').count()
    shipped_count = Order.query.filter_by(status='Shipped').count()
    delivered_count = Order.query.filter_by(status='Delivered').count()
    cancelled_count = Order.query.filter_by(status='Cancelled').count()

    return jsonify({
        "totalProducts": total_products,
        "totalOrders": total_orders,
        "totalUsers": total_users,
        "totalRevenue": round(total_revenue, 2),
        "lowStockCount": low_stock,
        "recentOrders": recent_orders_data,
        "ordersByStatus": {
            "processing": processing_count,
            "shipped": shipped_count,
            "delivered": delivered_count,
            "cancelled": cancelled_count
        }
    }), 200

# --- Admin: All Users ---
@app.route('/api/admin/users', methods=['GET'])
@admin_required
def admin_get_users():
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify([u.to_dict() for u in users]), 200

@app.route('/api/admin/users/<int:user_id>', methods=['DELETE'])
@admin_required
def admin_delete_user(user_id):
    user = User.query.get_or_404(user_id)
    if user.is_admin:
        return jsonify({"message": "Cannot delete admin user"}), 400
    # Clean up user's cart items
    CartItem.query.filter_by(user_id=user_id).delete()
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200

@app.route('/api/admin/users/<int:user_id>/toggle-admin', methods=['PUT'])
@admin_required
def admin_toggle_admin(user_id):
    user = User.query.get_or_404(user_id)
    user.is_admin = not user.is_admin
    db.session.commit()
    return jsonify({"message": f"User {'promoted to' if user.is_admin else 'demoted from'} admin", "user": user.to_dict()}), 200

# --- Admin: All Orders ---
@app.route('/api/admin/orders', methods=['GET'])
@admin_required
def admin_get_orders():
    orders = Order.query.order_by(Order.created_at.desc()).all()
    result = []
    for o in orders:
        user = User.query.get(o.user_id)
        result.append({
            "_id": str(o.id),
            "totalAmount": o.total_amount,
            "orderStatus": o.status,
            "createdAt": o.created_at.isoformat(),
            "customerName": user.name if user else "Unknown",
            "customerEmail": user.email if user else "N/A",
            "shippingAddress": json.loads(o.shipping_address) if o.shipping_address else {},
            "items": json.loads(o.items_json)
        })
    return jsonify(result), 200

@app.route('/api/admin/orders/<int:order_id>/status', methods=['PUT'])
@admin_required
def admin_update_order_status(order_id):
    order = Order.query.get_or_404(order_id)
    new_status = request.json.get('status')
    if new_status not in ['Processing', 'Shipped', 'Delivered', 'Cancelled']:
        return jsonify({"message": "Invalid status"}), 400
    order.status = new_status
    db.session.commit()
    return jsonify({"message": f"Order status updated to {new_status}"}), 200

# --- Admin: Product CRUD ---
@app.route('/api/admin/products', methods=['POST'])
@admin_required
def admin_create_product():
    data = request.json
    new_product = Product(
        name=data.get('name'),
        image=data.get('image', ''),
        description=data.get('description', ''),
        category=data.get('category', ''),
        price=float(data.get('price', 0)),
        stock=int(data.get('stock', 0)),
        rating=float(data.get('rating', 0))
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify(new_product.to_dict()), 201

@app.route('/api/admin/products/<int:product_id>', methods=['PUT'])
@admin_required
def admin_update_product(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.json
    product.name = data.get('name', product.name)
    product.image = data.get('image', product.image)
    product.description = data.get('description', product.description)
    product.category = data.get('category', product.category)
    product.price = float(data.get('price', product.price))
    product.stock = int(data.get('stock', product.stock))
    product.rating = float(data.get('rating', product.rating))
    db.session.commit()
    return jsonify(product.to_dict()), 200

@app.route('/api/admin/products/<int:product_id>', methods=['DELETE'])
@admin_required
def admin_delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted successfully"}), 200


# ==================== SEEDER LOGIC ====================
def seed_database():
    with app.app_context():
        db.create_all() # Generates SQLite DB instantly!
        
        dummy_products = [
            # Electronics & Computing
            {"name": "MacBook Pro 16-inch M3 Max", "category": "Electronics", "price": 3499.0, "stock": 12, "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80", "description": "The most advanced Mac ever created with the M3 Max chip."},
            {"name": "Dell UltraSharp 32-inch 4K Monitor", "category": "Electronics", "price": 899.99, "stock": 15, "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80", "description": "Perfect for creative professionals needing color accuracy."},
            {"name": "Mechanical Wireless Keyboard", "category": "Electronics", "price": 149.50, "stock": 50, "image": "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80", "description": "Tactile, responsive, and beautifully backlit."},
            
            # Mobile & Wearables
            {"name": "iPhone 15 Pro Titanium", "category": "Smartphones", "price": 1099.0, "stock": 25, "image": "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80", "description": "The first iPhone with an aerospace-grade titanium design."},
            {"name": "Pixel 8 Pro", "category": "Smartphones", "price": 999.0, "stock": 20, "image": "https://images.unsplash.com/photo-1696429103212-9c3f0b90e9d6?w=800&q=80", "description": "The all-pro phone engineered by Google."},
            {"name": "Apple Watch Ultra 2", "category": "Wearables", "price": 799.0, "stock": 18, "image": "https://images.unsplash.com/photo-1434493907317-a46b53b81822?w=800&q=80", "description": "The most rugged and capable Apple Watch."},
            {"name": "Galaxy Watch 6 Classic", "category": "Wearables", "price": 399.0, "stock": 30, "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80", "description": "The watch that knows you best is back with a refined rotating bezel."},

            # Audio
            {"name": "Sony WH-1000XM5 Headphones", "category": "Audio", "price": 398.0, "stock": 40, "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80", "description": "Industry-leading noise cancellation and breathtaking sound."},
            {"name": "AirPods Pro (2nd Gen)", "category": "Audio", "price": 249.0, "stock": 100, "image": "https://images.unsplash.com/photo-1588423770674-f28551404597?w=800&q=80", "description": "Active Noise Cancellation for immersive sound."},
            {"name": "Sonos Era 300 Speaker", "category": "Audio", "price": 449.0, "stock": 15, "image": "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80", "description": "With next-level audio that hits from every direction."},

            # Fashion & Clothing
            {"name": "Midnight Silk Minimalist Jacket", "category": "Fashion", "price": 189.5, "stock": 10, "image": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80", "description": "Crafted from ethically sourced weather-resistant materials."},
            {"name": "Classic Leather Chelsea Boots", "category": "Fashion", "price": 120.0, "stock": 25, "image": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80", "description": "Timeless design meeting modern comfort."},
            {"name": "Premium Cotton Hooded Sweatshirt", "category": "Fashion", "price": 65.0, "stock": 60, "image": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80", "description": "Heavyweight cotton with a relaxed fit for daily wear."},

            # Home & Living
            {"name": "ErgoSymmetry Executive Chair", "category": "Furniture", "price": 799.0, "stock": 5, "image": "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80", "description": "Premium mesh backing with adaptive lumbar support."},
            {"name": "Minimalist Oak Desk", "category": "Furniture", "price": 450.0, "stock": 7, "image": "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80", "description": "Solid wood desk with a clean, Scandinavian aesthetic."},
            {"name": "Smart Ambient Mood Lamp", "category": "Home Decor", "price": 85.0, "stock": 25, "image": "https://images.unsplash.com/photo-1507473884658-66050414bf3c?w=800&q=80", "description": "16 million colors to set the perfect atmosphere in any room."},
            {"name": "Succulent Arrangement Set", "category": "Home Decor", "price": 45.0, "stock": 50, "image": "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80", "description": "Zero maintenance life to brighten up your workspace."},

            # Kitchen & Appliances
            {"name": "Brezza Espresso Machine", "category": "Appliances", "price": 599.0, "stock": 12, "image": "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80", "description": "Professional grade espresso in the comfort of your kitchen."},
            {"name": "Smart Air Fryer Pro", "category": "Appliances", "price": 159.0, "stock": 30, "image": "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&q=80", "description": "Healthy frying with voice control and recipe presets."},

            # Gaming
            {"name": "PlayStation 5 Console", "category": "Gaming", "price": 499.0, "stock": 10, "image": "https://images.unsplash.com/photo-1606813907291-d86ebb9b740e?w=800&q=80", "description": "Experience lightning-fast loading and deeper immersion."},
            {"name": "Xbox Series X", "category": "Gaming", "price": 499.0, "stock": 8, "image": "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80", "description": "The fastest, most powerful Xbox ever."},
            {"name": "Nintendo Switch OLED", "category": "Gaming", "price": 349.0, "stock": 20, "image": "https://images.unsplash.com/photo-1578303328216-812425efb93c?w=800&q=80", "description": "Vibrant OLED screen for gaming on the go."}
        ]
        
        # Seed products if they don't exist
        print("Checking for missing products...")
        added_count = 0
        for p in dummy_products:
            if not Product.query.filter_by(name=p['name']).first():
                new_p = Product(**p)
                db.session.add(new_p)
                added_count += 1
        
        if added_count > 0:
            db.session.commit()
            print(f"Added {added_count} new products to the catalog.")
        else:
            print("Catalog is already up to date.")
        
        # Ensure admin user exists
        if not User.query.filter_by(email='admin@shopeasy.com').first():
            print("Creating admin user...")
            admin = User(
                name='Admin User',
                email='admin@shopeasy.com',
                password_hash=generate_password_hash('admin123'),
                is_admin=True
            )
            db.session.add(admin)
            db.session.commit()
            print("Admin user created: admin@shopeasy.com / admin123")

if __name__ == '__main__':
    seed_database()
    # Run natively on Port 5000 exactly like the Node server did
    app.run(debug=True, port=5000)
