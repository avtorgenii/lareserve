# Setup
## `.env`

Create `.env` file in current folder:

```dotenv
SECRET_KEY=<>
DEBUG=true

DB_NAME=lareserve_db
DB_USER=<>
DB_PASSWORD=<>
```

## Pycharm
Create venv
```
uv sync
```

Set project's interpreter in:

File > Settings > Interpreter > Add interpreter > Add local interpreter > Select existing > Type: `uv`, Path: `<folder_where_project_is>/lareserve/lareserve_backend/.venv/bin/python3`

## Database

```
make run-db
```

```
python manage.py makemigrations
python manage.py migrate
```

# Run

```
make run-server
```