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
pip install Flask Flask-CORS Flask-JWT-Extended
```

</details>

<details>
<summary><strong> Windwos </strong></summary>

```bash
cd backend
py -3 -m venv .venv
.venv\Scripts\activate
pip install Flask Flask-CORS Flask-JWT-Extended
```

</details>

## Run Locally

```bash
python -m flask
```
