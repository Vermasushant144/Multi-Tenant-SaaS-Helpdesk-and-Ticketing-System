INSERT INTO tenants(company_name, company_code)
VALUES ('ABC Pvt Ltd', 'ABC001');

INSERT INTO users(
name,
email,
password,
role,
tenant_id
)
VALUES(
'Admin User',
'admin@abc.com',
'123456',
'TENANT_ADMIN',
1
);