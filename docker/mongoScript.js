print("Creating application user.");
admin_db = db.getSiblingDB("admin");
admin_db.createUser({
    user: "blogapp",
    pwd: "blogapp",
    roles: [
        { role: "readWrite", db: "blogDB" }
    ]
});
print("Application user created.");

print("Creating users collection in blogDB and default user.");
blogDB = db.getSiblingDB("blogDB");
blogDB.createCollection('users', { capped: false });
blogDB.users.insert({
    email: "testuser@test.com",
    password: "test"
});
print("Collection and test user created.");

print("Creating sessions collection in blogDB.");
blogDB.createCollection('sessions', { capped: false });
print("Collection user created.");