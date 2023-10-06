from flask import Flask, request, render_template, redirect
from flask_sqlalchemy import SQLAlchemy
from flask import jsonify
import json


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
    
    @property
    def serialize(self):
       """Return object data in easily serializable format"""
       return {
           'id'         : self.id,
           'actual_url' : self.actual_url,
           'go_link'  : self.go_link,
       }

@app.route("/")
def main():
    go_links = GoLink.query.all()

    return render_template('index.html', go_links=go_links)

@app.route("/add_data")
def add_data():
    return render_template('add_go_link.html')

@app.route("/create", methods=["POST"])
def create():
    if request.method == 'POST': 
        data = request.get_json()
        actual_url = data['actual_url']
        go_link = data['go_link']
        if actual_url != '' and go_link != '':
            p = GoLink(actual_url=actual_url, go_link=go_link)
            db.session.add(p)
            db.session.commit()
            return jsonify(data=[{"go_link": go_link, "success": True}])
        else:
            return jsonify(data=[{"success": False}])

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
        return jsonify(data=[{"go_link": go_link, "success": True}])
    else:
        return jsonify(data=[{"success": False}])

@app.route('/go/<link>', methods=["GET"])
def go(link):
    actual_url = GoLink.query.filter(GoLink.go_link == f"go/{link}").first().actual_url
    return jsonify(data=[{"actual_url": actual_url}])

@app.route('/go_links', methods=["GET"])
def get_go_links():
    # data = GoLink.query.all()
    return jsonify(data=[i.serialize for i in GoLink.query.all()])
        
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