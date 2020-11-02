# Enkel handel av Kandidatkul

This is the repo for the e-commerce page "Enkelhandel".

## SETUP FOR TESTING

1. Read "Create a virtual environment" & "Activate the virtual environment"

2. Run *pip install -r requirements.txt*

3. Read topic "For Stripe API" below

4. Run *python setup_db.py 1EckKs3VohOQ8p32payJDdmgWRsMMLwMj server.db*

   ------------------------

   

### Create a virtual environment

*python3 -m venv venv*

### Activate the virtual environment

*source venv/bin/activate* (Mac/Linux and Windows Git Bash)

### Save all currently used packages

*pip freeze > requirements.txt*

### Install requirements

*pip install -r requirements.txt*

### Pull remote branch

*git checkout --track origin/BRANCH_NAME*

### How to access the api 1.1

*All products are listed in products2.json with five attributes as of 1.1:
"prodID", "name", "desc", "price", "pictureURL"

each product is in list subcategory, and category respectively(see products2.json)

all are accessed by navigating to url:
localhost:5000/api/products -to list all products and attributes
localhost:5000/api/products/int:id - to list product with a integer id(today ranging from 1-4)
localhost:5000/api/category - returns a list in json of all category names and associated ID's available
localhost:5000/api/category/<int:catID> - returns a list in json of all SubCategories in given categoryID, today 1 or 2.

### PUT_IN_GITIGNORE

Content of *PUT_IN_GITIGNORE* should be copied to your local .gitignore file.

### For Stripe API

In project base create a file named `.env` put the following in the file.

```textile
PUBLISHABLE_STRIPE_KEY=pk_test_R5wLSATF0N7zlPnO1P3bkcyV00iY67m0ET
SECRET_STRIPE_KEY=sk_test_2lOs7kLwx309wpSi2UhfADih00jxdNiYpw
```
