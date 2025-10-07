# orderpunch
# create virtual environment 
    python -m ven Orderpunch
# activate 
     source Orderpunch/bin/activate
# change working directory 
    cd Orderpunch/orderpunch
# install packages 
  pip install -r requirements.txt
# start devlopment server
    python manage.py runserver 
# For changepassword for user (after activating virtual environment):
		python manage.py changepassword username
# For create new user 
    python manage.py createuser username email password 
# example :  python manage.py createuser sid1 sid@gmail.com Abc@123456
# For Delete User :
    python manage.py delete username

# Note : for market watchlist create linux script and automate it through systemct.
# Note:  use gunicorn and uvicorn to start django server and websocket server.
