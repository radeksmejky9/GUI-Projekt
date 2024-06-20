FROM python:3.9

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /backend

COPY ./requirements.txt /backend
RUN pip install -r requirements.txt

COPY ./app /backend/app

EXPOSE 8000

WORKDIR /backend/app

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
