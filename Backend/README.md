# Interns Hackathon - KidsPay App Backend

<!-- TODO  add some description-->

## Backend Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop) for spawning Postgres DB.
- [Python3.7+](https://www.python.org/downloads/).

## PayPal APIs used

- [**Payouts API**](app/core/paypal_admin.py)
- **Identity API**
- **Checkout API**

## Installation

- Create .env file with fields from .env.example file

- Spawn the postgres DB with

```bash
docker-compose up -d
```

- Create virtualenv and activate it.

```bash
python3 -m venv .venv
source .venv/bin/activate
```

- Install python packages to the virtual environment.

```bash
pip install -r app/requirements.txt
```

- Create DB Tables.

```bash
PYTHONPATH=. python app/initial_data.py
```

- Start the server

```bash
uvicorn app.main:app
```

- Visit http://localhost:8000/docs or http://localhost:8000/redoc for the docs.
