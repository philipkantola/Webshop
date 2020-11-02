# For reference: https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-iv-database

# HOW TO MIGRATE
# flask db migrate -m "COMMENT SAYING WHAT WAS CHANGED" # Creates migration scripts
# flask db upgrade # Does the actual changes to the DB according to migration scripts

# TO DOWNGRADE: flask db downgrade

# ------GOOD TO KNOW------
# Note that Flask-SQLAlchemy uses a "snake case" naming convention for database tables by default.
# (i.e) For the model User, the corresponding table in the database will be named user.
# For a AddressAndPhone model class, the table would be named address_and_phone.
# If you prefer to choose your own table names, you can add an attribute named __tablename__ to
# the model class, set to the desired name as a string.
# ------------------------------
import math
import time
import datetime
import hashlib
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from server import db, login


# How each enitiy looks. copy the commented rows below and paste them. Uncomment and change accordingly
# class NAME_OF_ENTITY(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(64), index=True, unique=True)
#     email = db.Column(db.String(120), index=True, unique=True)
#     password_hash = db.Column(db.String(128))
#     posts = db.relationship('Post', backref='author', lazy='dynamic') # If you have a one-to-may realtionship this can be used to get "the many from the one"


#     def __repr__(self): # function which displays short info about the entity in question.
#         return '<User {}>'.format(self.username)

# This is an eaxmple using foreignKey referencing column id on table user
# class Post(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     body = db.Column(db.String(140))
#     timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

#     def __repr__(self):
#         return '<Post {}>'.format(self.body)

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(15), index=True, unique=True)
    # To query for all subcats for a given cat.
    sub_cats = db.relationship(
        'SubCategory', backref='category', lazy='dynamic')

    # function which displays short info about the entity in question.
    def __repr__(self):
        return '<Category {} with id {}>'.format(self.name, self.id)


class SubCategory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(15))
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    # To query for all products for a given sub_cat.
    # products = db.relationship('Product', backref='product', lazy='dynamic')
    sub_sub_cats = db.relationship(
        'SubSubCategory', backref='sub_category', lazy='dynamic')

    def __repr__(self):
        return '<SubCategory {}>'.format(self.name)

class SubSubCategory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(15))
    sub_category_id = db.Column(db.Integer, db.ForeignKey('sub_category.id'))
    # To query for all products for a given sub_cat.
    # products = db.relationship('Product', backref='product', lazy='dynamic')
    products = db.relationship(
        'Product', backref='sub_sub_category', lazy='dynamic')

    def __repr__(self):
        return '<SubSubCategory {}>'.format(self.name)


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    desc = db.Column(db.String(600))
    price = db.Column(db.Float)
    img = db.Column(db.String(300))
    sub_cat_id = db.Column(db.Integer, db.ForeignKey('sub_sub_category.id'))
    sales = db.relationship(
        'Sale', backref='product', lazy='dynamic')

    def __repr__(self):
        return '<Product {}>'.format(self.name)


class Customer(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(20))
    lastname = db.Column(db.String(20))
    email = db.Column(db.String(50), unique=True)
    hashedpass = db.Column(db.String(128))
    orders_made = db.relationship(
        'Order', backref='customer', lazy='dynamic')

    def set_password(self, password):
        self.hashedpass = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.hashedpass, password)

    def removeNonPaidOrders(self):
        orders = self.orders_made.all()
        for order in orders:
            if order.receipt == "":
                order.removeOrder()
        db.session.commit()


class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    billingSum = db.Column(db.Float)
    date = db.Column(db.Integer)
    receipt = db.Column(db.String(300))
    stripe_charge_id = db.Column(db.String(50))
    customer_id = db.Column(
        db.Integer, db.ForeignKey('customer.id'), index=True)
    sales_in_order = db.relationship(
        'Sale', backref='order', lazy='dynamic')

    def __repr__(self):
        return '<Order {}>'.format(self.id)

    def totalToPay(self):
        # print("RUNNING SUM FUNCTION")
        totalToPay = 0
        sales = self.sales_in_order.all()
        for s in sales:
            p = Product.query.get(s.product_id)
            totalToPay += s.amount * p.price
            # print(s.product_id, s.amount)
        totalToPay = math.ceil(totalToPay)
        # print("total: ",totalToPay)
        return totalToPay

    def orderHash(self):
        toHash = str(int(self.billingSum)+self.date)
        print("tohash ", toHash)
        strHash = hashlib.md5(toHash.encode()).hexdigest()
        print("strHash ", strHash)
        return strHash

    def removeOrder(self):
        Sale.query.filter_by(order_id=self.id).delete()
        db.session.commit()
        Order.query.filter_by(id=self.id).delete()
        db.session.commit()

    def dateHuman(self):
        datetimeObj = datetime.datetime.fromtimestamp(self.date)
        return datetime.datetime.date(datetimeObj)


class Sale(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), index=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    amount = db.Column(db.Integer)

    def __repr__(self):
        return '<Sale {}>'.format(self.id)


@login.user_loader
def load_user(id):
    return Customer.query.get(int(id))


def adminRemoveNonPaidOrders():
    orders = Order.query.all()
    for order in orders:
        if order.receipt == "":
            print("Removing order ", str(order.id))
            order.removeOrder()
