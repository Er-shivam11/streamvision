# OTT Video Streaming

A full-stack video library built with React and Django REST Framework. Users can browse uploaded videos, search the library, open video details, log in, and upload new video files.

## Project Structure

```text
backend/    Django project, REST API, database configuration, media processing
frontend/   React application
```

```text
streamvision/
│
├── backend/
│   │
│   ├── media/
│   │   ├── frames/
│   │   ├── hls/
│   │   ├── sample/
│   │   └── thumbnails/
│   │
│   ├── MyOtt/
│   │   ├── __pycache__/
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   │
│   ├── VideoStreaming/
│   │   ├── __pycache__/
│   │   ├── migrations/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   │
│   ├── db.sqlite3
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   │
│   ├── build/
│   ├── node_modules/
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── About/
│   │   │   │   ├── About.css
│   │   │   │   └── About.js
│   │   │   │
│   │   │   ├── Footer/
│   │   │   │   ├── Footer.css
│   │   │   │   └── Footer.js
│   │   │   │
│   │   │   ├── Header/
│   │   │   │   ├── Header.css
│   │   │   │   └── Header.js
│   │   │   │
│   │   │   ├── Login/
│   │   │   │   ├── Login.css
│   │   │   │   └── Login.js
│   │   │   │
│   │   │   ├── Videolist/
│   │   │   │   ├── Videolist.css
│   │   │   │   └── Videolist.js
│   │   │   │
│   │   │   └── VideoUpload/
│   │   │       ├── VideoUpload.css
│   │   │       └── VideoUpload.js
│   │   │
│   │   ├── pages/
│   │   │   ├── Home/
│   │   │   │   ├── Home.css
│   │   │   │   └── Home.js
│   │   │   │
│   │   │   └── VideoDetail/
│   │   │       ├── VideoDetail.css
│   │   │       └── VideoDetail.js
│   │   │
│   │   └── services/
│   │
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```



## Features

- Video library with featured and recently added videos
- Search by video title
- Video detail pages with playback and related videos
- Drag-and-drop video upload with title and description
- Login endpoint backed by Django authentication
- Automatic thumbnail generation with `ffmpeg`
- HLS output in 360p, 720p, and 1080p
- Django admin and REST API

## Requirements

- Python 3.10 or newer
- Node.js and npm
- MySQL Server
- `ffmpeg` available on the system `PATH`

The backend dependencies are listed in [backend/requirements.txt](backend/requirements.txt). The frontend dependencies are listed in [frontend/package.json](frontend/package.json).

## Backend Setup

The current Django settings use MySQL, not the checked-in SQLite database file.

Create a MySQL database named `ott_video_streaming`, then configure the credentials in `backend/MyOtt/settings.py` if your local MySQL setup differs from the defaults:

```python
DATABASES = {
	'default': {
		'ENGINE': 'django.db.backends.mysql',
		'NAME': 'ott_video_streaming',
		'USER': 'root',
		'PASSWORD': '',
		'HOST': 'localhost',
		'PORT': '3306',
	}
}
```

From the repository root, create and activate a virtual environment and install the dependencies:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
```

Run migrations and start the API:

```powershell
cd backend
python manage.py migrate
python manage.py runserver
```

The backend runs at `http://localhost:8000`.

## Frontend Setup

In a second terminal:

```powershell
cd frontend
npm install
npm start
```

The frontend runs at `http://localhost:3000` and expects the backend at `http://localhost:8000`.

## Frontend Routes

| Route | Purpose |
| --- | --- |
| `/` | Home page |
| `/VideoList` | Video library |
| `/video/:id` | Video details and playback |
| `/VideoUpload` | Upload a video |
| `/login` | Login form |
| `/about` | About page |

## API Endpoints

The API is prefixed with `/api/`:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/login/` | Authenticate a Django user |
| `GET` | `/api/media/` | List media files |
| `POST` | `/api/media/` | Upload a media file |
| `GET` | `/api/media/<id>/` | Get one media file |
| `PUT/PATCH` | `/api/media/<id>/` | Update a media file |
| `DELETE` | `/api/media/<id>/` | Delete a media file |

Uploaded videos are stored under `backend/media/sample/`. During upload, the backend invokes `ffmpeg` to create a thumbnail and HLS files under `backend/media/hls/<id>/`.

## Useful Commands

Backend tests:

```powershell
cd backend
python manage.py test
```

Frontend production build:

```powershell
cd frontend
npm run build
```

## Configuration Notes

- `DEBUG` is enabled and all hosts/CORS origins are currently allowed. These settings should be restricted before production deployment.
- The frontend uses the hard-coded API URL `http://localhost:8000` in several components.
- `ffmpeg` is required for video uploads to finish processing.
- The requirements file pins Django 4.2, while the settings file was generated from a Django 5.1 project. Keep those versions aligned when changing the environment.
