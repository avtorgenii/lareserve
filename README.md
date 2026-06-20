# LaReserve

Projekt składa się z frontendu i backendu, który należy uruchomić niezależnie.

## Wymagania
- Docker
- Python
- Node.js 18

## Uruchomienie backendu
Zaczynając od `root` sklonowanego repozytorium:
```bash
cd ./lareserve_backend
```

Należy stworzyć plik `.env` wypełniony danymi:
```
SECRET_KEY=<>
DEBUG=true

DB_NAME=lareserve_db
DB_USER=<>
DB_PASSWORD=<>

CORS_CSRF_ALLOWED_ORIGINS="http://localhost:3000"
```

Następnie:
```bash
docker compose up -d

python manage.py migrate

python manage.py seed_data

python manage.py runserver
```

## Uruchomienie frontendu
Zaczynając od `root` sklonowanego repozytorium:
```bash
cd ./lareserve_frontend

npm install

npm run dev
```

Na `localhost:3000` powinna zostać uruchomiona strona internetowa. Przy pierwszym wejściu nie na stronę kliencką nie będzie możliwe zarezerwowanie terminu, ponieważ nie został
utworzony plan restauracji. W tym celu należy przejść na stronę dla pracowników `localhost:3000/staff` i zalogować się na sztucznie założone konto pracownika `worker@lareserve.com`, hasło `password123`.

Po pomyślnym zalogowaniu, w prawym górnym rogu znajduje się przycisk do przejścia na stronę edycji planu. Po utworzeniu i zapisaniu planu można przejśc na stronę kliencką
`localhost:3000` i dowolnie korzystać z aplikacji.
