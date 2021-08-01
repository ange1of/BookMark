## 🏠 BookMark 
Booking service for hotel business

---

### ⚙️ Stack

Front: Angular 12 (Angular Material)  
Back: Django 3.2 (DRF)  
DB: Postgres  
Deployment: docker-compose, nginx

### 👨‍💻 Development

*Requirements: docker, docker-compose, Python >= 3.8, Node.js 14*  

To setup development environment with live server, run following commands

    # DB
    cd docker
    docker-compose up -d postgres  # other services can be used for testing
    
    # Back
    cd backend
    python -m pip install -r requirements.txt
    python manage.py runserver 0.0.0.0:8000
    
    # Front
    cd frontend
    npm install
    npm start

### 🔨 Deployment

*Requirements: Linux-based OS (tested on Ubuntu 20.04), docker, docker-compose, make*

Follow these steps:  
* Create file `.env.backend` with environment variables for backend:


    APP_DEBUG=0  
    DJANGO_SETTINGS_MODULE=booking.settings  
    SECRET_KEY=<django_secret_key>  
    APP_DB_PASSWORD=<db_password>  
    APP_DB_HOST=<db_host>  
    ...  # Other settings (e.g. APP_DB_USER)  


* Create file `.env.postgres` with environment variables for postgres (must match with the backend settings):


    POSTGRES_DB=<postgres_db>  
    POSTGRES_USER=<postgres_user>  
    POSTGRES_PASSWORD=<postgres_password>  


* Run `make all` from project root.
* Copy created archive `booking.tar.gz` to the server
* Unarchive it: `tar -xzvf booking.tar.gz`
* Go to the extracted `build` folder
* Run `make install`
* Add necessary settings to the global nginx config.
