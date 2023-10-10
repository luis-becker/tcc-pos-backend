db = db.getSiblingDB('development-db');
db.createUser(
  {
    user: "backend-service",
    pwd: "password",
    roles: [
      {
        role: "readWrite",
        db: "development-db"
      }
    ]
  }
);