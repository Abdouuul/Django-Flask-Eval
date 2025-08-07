FROM python:3-slim

RUN apt-get update && apt-get dist-upgrade -y
RUN useradd -m appuser
WORKDIR /app 
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r requirements.txt 
RUN pip install --no-cache-dir gunicorn psycopg2-binary
COPY . . 
RUN mkdir -p /app/static
RUN chown -R appuser /app
USER appuser 
EXPOSE 8000
CMD ["gunicorn", "APIEval.wsgi:application", "--bind", "0.0.0.0:8000"]