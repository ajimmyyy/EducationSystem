# 大學校務選庫系統

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## 環境

PostgreSQL,\
Node.js,

## 文件

測試帳號

```bash
student:
    學號: 3754
    密碼: A000000001

teacher:
    學號: 3757
    密碼: T000000001

manager:
    學號: 3760
    密碼: 00000000
```

## Getting Started

1. 安裝 [Node.js](https://nodejs.org/en)\
    安裝 [PostgreSQL](https://www.postgresql.org/)

2. 初始化

    ```bash
    npm i
    ```

3. 在專案目錄下建立.env

    ```bash
    #project/.env:
    DATABASE_URL = "postgresql://User Name: Password@localhost:Port Number/DataBase Name"
    ```

    ex.
    - "postgresql://postgres:12345678@localhost:5432/testDataBase

4. Push SQL 資料

     ```bash
    npx prisma db push
    ```

5. 運行開發伺服器:

    ```bash
    npm run dev
    ```

    用瀏覽器開啟[http://localhost:3000](http://localhost:3000)

6. 灌資料庫資料

    用瀏覽器開啟[http://localhost:3000/api/system/injectCoursesData?registerword=dkelgowsmn](http://localhost:3000/api/system/injectCoursesData?registerword=dkelgowsmn)
    [http://localhost:3000/api/system/injectUsersData?registerword=dkelgowsmn](http://localhost:3000/api/system/injectUsersData?registerword=dkelgowsmn)

## Learn More
