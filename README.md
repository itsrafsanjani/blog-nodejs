# NodeJS Blog with TypeORM

Steps to run this project:

- Run `npm install` command
- Create a `mysql` database
- Copy `.env.example` to `.env` using `cp .env.example .env`
- Update database credentials in `.env`
- Run `npm run app:key`
- Run `npm run jwt:secret`
- Run `npm start` command

## TODO

- [x] Authentication using JWT
- [x] Add TypeORM Custom Validation
- [x] Send email verification notification with OTP
- [ ] Post (Blog) CRUD with file upload
- [ ] Host to Digital Ocean
- [ ] Frontend with NuxtJS
- [ ] Switch from PHP to Node! 😂 :alien:
