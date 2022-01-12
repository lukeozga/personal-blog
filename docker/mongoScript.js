print("Create application user.");
db = db.getSiblingDB("admin");
db.createUser({
    user: "blog",
    pwd: "blog",
    roles: [
        { role: "readWrite", db: "blogDB" }
    ]
});
print("Application user created.");