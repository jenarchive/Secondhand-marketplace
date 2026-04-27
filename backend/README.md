# Backend - Secondhand Marketplace

This folder contains the backend for the Secondhand Marketplace app, written in python using flask.
It acts as a bridge between the frontend and the backend, managing api requests and authentication.

## Prerequisites

Ensure you have Python 3.10+ installed.

## Setup Environment and Install Dependencies

<details>
<summary><strong> Linux/Mac </strong></summary>

```bash
cd backend
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
```

</details>

<details>
<summary><strong> Windows </strong></summary>

```bash
cd backend
py -3 -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

</details>

## Run Locally

```bash
flask --app app run
```

## Structure
```text
backend                            # Flask API: Handles business logic and data processing
├── README.md                      # Backend overview and structure
├── app                            # Core Flask app (Routes: Auth, Home, Item listings, Upload Items)
├── tests                          
├── requirements.txt               # Backend dependencies (Flask, SQLAlchemy, etc.)
├── run.py                         # Server entry point: Starts the Flask development server
└── .pylintrc                      # Adjustment for pylint in CI 
```