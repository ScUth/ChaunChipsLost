#  Touch grass

## Important!!!
run
```bash
curl -X POST http://127.0.0.1:8000/api/train/
```
every time after starting the back-end (note: replace 127.0.0.1:8000 if using difference ip or port)

## Prerequisites
Make sure you have the following installed on your machine:

- Python 3.8 or higher  
- pip (Python package installer)

**also create .env file from .env.example**

---

## Installation & Setup

### 1. Clone or Download the Repository
Navigate to the project folder in your terminal:

```bash
cd backend
```

### 2. Create a Virtual Environment (Recommended)

```bash
python -m venv venv
```

Activate it:

- **Windows:**
```bash
venv\Scripts\activate
```

- **Mac/Linux:**
```bash
source venv/bin/activate
```

### 3. Install Requirements

```bash
pip install -r requirements.txt
```

### 4. Run the server
for localhost
```bash
python3 manage.py runserver
```
for shared network or port forwarding
```bash
python3 manage.py runserver 0.0.0.0:8000
```
