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

Create venv or add new packages from `pyproject.toml`

```
uv sync
```

Set project's interpreter in:

File > Settings > Interpreter > Add interpreter > Add local interpreter > Select existing > Type: `uv`, Path:
`<folder_where_project_is>/lareserve/lareserve_backend/.venv/bin/python3`

## Database

```
make run-db
```

```
python manage.py makemigrations
python manage.py migrate
```

## SSO

Run `uv sync` and apply migrations before continuing

1. Table `django_site`

```
id	domain	        name
2	127.0.0.1:8000	La Reserve
```

2. Table `socialaccount_socialapp`

`client_id` and `client_secret` are from `.json` in discord

```
id	provider   name	        client_id	            secret
1	google	   Google SSO	<client_id>         	<client_secret>
```

3. Table `socialaccount_socialapp_sites`

```
id	socialapp_id	site_id
1	1	            2
```

# Run

```
make run-server
```