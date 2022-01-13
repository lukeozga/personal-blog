print("Create application user.");
admin_db = db.getSiblingDB("admin");
admin_db.createUser({
    user: "blogapp",
    pwd: "blogapp",
    roles: [
        { role: "readWrite", db: "blogDB" }
    ]
});
print("Application user created.");

print("Create users collection in blogDB and default user.");
blogDB = db.getSiblingDB("blogDB");
blogDB.createCollection('users', { capped: false });

blogDB.users.insert({
    email: "testuser@test.com",
    password: "test"

});
print("Test user created.");