import os
import json
import math
import stripe
import time
import hashlib
from flask import render_template, jsonify, json, abort, make_response, request, redirect, flash, url_for
from flask_login import current_user, login_user, login_required, logout_user
from werkzeug.urls import url_parse
from server import app, db
from server.forms import LoginForm, RegistrationForm
from server.models import Category, SubCategory, SubSubCategory, Product, Order, Sale, Customer

stripe_keys = {
    'secret_key': os.environ['SECRET_STRIPE_KEY'],
    'publishable_key': os.environ['PUBLISHABLE_STRIPE_KEY']
}

stripe.api_key = stripe_keys['secret_key']


@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('my_page'))
    form = LoginForm()
    if form.validate_on_submit():
        user = Customer.query.filter_by(email=form.email.data).first()
        if user is None:
            flash("Användaren med denna mailadress finns inte.")
            return redirect(url_for('login'))
        if not user.check_password(form.password.data):
            flash('Lösenordet matchar inte mailadressen.')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            # print("\n\welcome\n\n")
            next_page = url_for('welcome')
        return redirect(next_page)
    return render_template('login.html', title='Logga in', form=form)


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('welcome'))


@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('welcome'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = Customer(email=form.email.data,
                        firstname=form.firstname.data, lastname=form.lastname.data,)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)


@app.route('/my_page')
@login_required
def my_page():
    return render_template('my_page.html', title="Dina sidor")


@app.route('/test')
def test():
    return render_template('test.html')


@app.route('/orderhistorik')
@login_required
def orderhistorik():
    current_user.removeNonPaidOrders()
    orders = current_user.orders_made.all()
    return render_template('orderhistorik.html', orders=orders)


@app.route('/')
@app.route('/welcome')
def welcome():
    return render_template('welcome.html', title="Enkel Handel")


@app.route('/about')
def about():
    return render_template('about.html', title="Om Enkel Handel")


@app.route('/handla/', defaults={'path': ''})
@app.route('/handla/<path:path>')
def handla(path):
    user = {'username': 'Tester'}
    return render_template('base_shopping.html', title='Handla!', user=user)

# @app.route('/handla')
# def handla():
#     user = {'username': 'Tester'}
#     return render_template('base_shopping.html', title='Handla!', user=user)

# @app.route('/handla/<path:subpath>')
# def show_subpath(subpath):
#     # show the subpath after /path/
#     # return 'Subpath %s' % subpath
#     return redirect(url_for('handla'))


@app.route('/checkout', methods=['POST'])
def checkout():
    try:
        data = json.loads(request.data.decode('utf8'))
    except Exception:
        abort(404)

    # Creating order for later use
    timestamp = int(time.time())
    order = Order(billingSum=0, date=timestamp, receipt="")
    if current_user.is_authenticated:
        order.customer_id = current_user.id
    db.session.add(order)
    db.session.commit()

    # print("------checkout METHOD------")
    items = []
    for item in data:
        p = Product.query.get(item['id'])
        s = Sale(order_id=order.id, product_id=p.id, amount=item['amount'])
        db.session.add(s)
        items.append({'product': p, 'amount': item['amount']})

    db.session.commit()
    order.billingSum = order.totalToPay()
    strHash = order.orderHash()

    db.session.commit()
    return render_template('checkout.html', totalToPay=order.billingSum, items=items, stripe_pk_key=stripe_keys['publishable_key'], hashval=strHash, orderId=order.id, current_user=current_user)


@app.route('/pay', methods=['POST'])
def pay():
    # form -> var
    form = request.form
    # Hämta order
    order = int(form['orderId'])
    order = Order.query.get(order)
    # validera order
    correctHash = order.orderHash()
    incomingHash = form['checkval']
    # Kolla om requestad order matchar verklig eller om det spoofats / annat fel
    if correctHash != incomingHash:
        # print("HASH MISMATCH!")
        return render_template('post_payment.html', title='FEL!', paid=False, receipt_url=None)
    # Get stripe token
    token = form['stripeToken']
    # Genomför charge

    try:
        charge = stripe.Charge.create(
            # Stripe wants amount in öre/ cent therefore X100
            amount=int(order.billingSum * 100),
            currency='sek',
            description=('Enkel Handel ' + time.ctime(order.date)),
            source=token,
            metadata={'order_id': order.id},
        )
    except stripe.error.InvalidRequestError as e:
        return render_template('post_payment.html', title='FEL!', paid=False, receipt_url=None)

    # Kolla charge
    # print("charge: ", charge)
    # Lägg till receipt URL till order
    order.receipt = charge["receipt_url"]
    order.stripe_charge_id = charge["id"]
    db.session.commit()
    # Returnera sida i enlighet med status av genomfört köp.
    return render_template('post_payment.html', title='Betalat!', paid=True, receipt_url=order.receipt, loggedIn=current_user.is_authenticated)


@app.route('/api/check_login')
def see_if_logged_in():
    retData = []
    # print("\n\n", current_user.is_authenticated)
    if current_user.is_authenticated:
        retData.append({
            'name': current_user.firstname,
            'auth': True
        })
    else:
        retData.append({
            'auth': False
        })

    return jsonify(retData)


@app.route('/api/products/<int:id>', methods=['GET'])  # Hamtar
def get_product(id):

    p = Product.query.get(id)

    # ifall p är av typ NoneType betyder det att en product med det id:t inte finns i databasen, skickar vi en 404-page da sokt id ej existerar
    if type(p) == type(None):
        abort(404)

    prodList = []
    prodList.append({
        'id': p.id,
        'name': p.name,
        'desc': p.desc,
        'price': p.price,
        'img': p.img
    })

    return jsonify(prodList)


@app.route('/api/products', methods=['GET'])
def get_products():
    # products = Product.query.all()
    # Returns products in ordered list.
    products = db.session.query(Product).order_by(Product.name).all()
    prodList = []
    for p in products:
        prodList.append({
            'id': p.id,
            'name': p.name,
            'desc': p.desc,
            'price': p.price,
            'img': p.img
        })

    return jsonify(prodList)


# responds with a list in json format of all categories(and their corresponding) available "huvudkategorier"
# Bad practice to have categories / category changed this
@app.route('/api/category', methods=['GET'])
def get_categories():

    # cats = Category.query.all()
    cats = db.session.query(Category).order_by(Category.name).all()

    catList = []

    for cat in cats:
        catList.append({'catName': cat.name, 'catID': cat.id})

    if len(catList) == 0:
        abort(404)
    return jsonify(catList)


# Lists all subcategories in given categoryID "UNDERKATEGORI-VY"
@app.route('/api/category/<int:catID>', methods=['GET'])
def get_subcat(catID):

    # get list of sub categories
    cat = Category.query.get(catID)
    if not cat:
        abort(404)
    subcats = cat.sub_cats.all()
    subcats.sort(key=lambda subcat: subcat.name)

    out = []
    for subcat in subcats:
        out.append({'subcatName': subcat.name, 'subcatID': subcat.id})

    return jsonify(out)

    # Lists all subsubcategories


@app.route('/api/category/<int:catID>/<int:subcatID>', methods=['GET'])
def get_subsubcat(catID, subcatID):
    print("\n\ncatID: ", catID, "\nsubcatID: ", subcatID, "\n\n")
    # get list of subsubcategories
    subcat = SubCategory.query.get(subcatID)
    print(subcat)
    subsubcats = subcat.sub_sub_cats.all()
    print(subsubcats)
    subsubcats.sort(key=lambda subsubcat: subsubcat.name)

    out = []
    for subsubcat in subsubcats:
        out.append({'subsubcatName': subsubcat.name,
                    'subsubcatID': subsubcat.id})

    if len(out) == 0:
        abort(404)
    return jsonify(out)

# Lists all products in subsubcategory
@app.route('/api/category/<int:catID>/<int:subcatID>/<int:subsubcatID>/products', methods=['GET'])
def get_CatProducts(catID, subcatID, subsubcatID):

    subsubcat = SubSubCategory.query.get(subsubcatID)
    if type(subsubcat) == type(None):
        abort(404)

    products = subsubcat.products.all()
    products.sort(key=lambda product: product.name)

    prodList = []
    for p in products:
        prodList.append({
            'id': p.id,
            'name': p.name,
            'desc': p.desc,
            'price': p.price,
            'img': p.img
        })

    if len(prodList) == 0:
        abort(404)
    # subCat = [subCat['subCatName'] for subCat in cat['subCat']]
    return jsonify(prodList)


# Istället för att skicka error i html format när requestar via API så skickas det i json format
@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)
