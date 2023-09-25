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
db.createCollection('users');
db.createCollection('auth');
db.createCollection('schedules');

db = db.getSiblingDB('test-db');
db.createUser(
  {
    user: 'test-user',
    pwd: 'password',
    roles: [
      { role: 'readWrite',
       db: 'test-db' 
      }
    ],
  },
);
db.createCollection('users');
db.createCollection('auth');
db.createCollection('schedules');