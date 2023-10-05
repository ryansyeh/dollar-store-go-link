from flask import Flask, request, render_template, redirect
from flask_sqlalchemy import SQLAlchemy

# Import for Migrations
from flask_migrate import Migrate, migrate

app = Flask(__name__)
app.debug = True

# adding configuration for using a sqlite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'

# Creating an SQLAlchemy instance
db = SQLAlchemy(app)

 
# Settings for migrations
migrate = Migrate(app, db)

class GoLink(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	
	actual_url = db.Column(db.String(100), unique=False, nullable=False)
	
	go_link = db.Column(db.String(40), unique=False, nullable=False)

@app.route("/")
def main():
	go_links = GoLink.query.all()

	return render_template('index.html', go_links=go_links)

@app.route("/add_data")
def add_data():
	return render_template('add_go_link.html')


# function to add go links
@app.route('/add', methods=["POST"])
def go_link():
     
    # In this function we will input data from the 
    # form page and store it in our database.
    # Remember that inside the get the name should
    # exactly be the same as that in the html
    # input fields
    actual_url = request.form.get("actual_url")
    go_link = request.form.get("go_link")
 
    # create an object of the Profile class of models
    # and store data as a row in our datatable
    if actual_url != '' and go_link != '':
        p = GoLink(actual_url=actual_url, go_link=go_link)
        db.session.add(p)
        db.session.commit()
        return redirect('/')
    else:
        return redirect('/')
        
@app.route('/delete/<int:id>')
def erase(id):
    # Deletes the data on the basis of unique id and 
    # redirects to home page
    data = GoLink.query.get(id)
    db.session.delete(data)
    db.session.commit()
    return redirect('/')

if __name__ == "__main__":
	app.run()