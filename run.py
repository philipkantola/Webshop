from server import app, db
from server.models import Category, SubCategory, Product, Order, Sale, Customer, adminRemoveNonPaidOrders


@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'Category': Category, 'SubCategory': SubCategory, 'Product': Product, 'Order': Order, 'Sale': Sale, 'Customer': Customer, 'adminRemoveNonPaidOrders': adminRemoveNonPaidOrders}
