# RoboSim Backend

سرور و API پلتفرم RoboSim — ساخته‌شده با Express.js و TypeScript.

## اجرا

```bash
# نصب وابستگی‌ها
npm install

# حالت توسعه (با reload خودکار)
npm run dev

# build
npm run build

# اجرای نسخه‌ی build‌شده
npm start
```

سرور روی `http://localhost:3000` اجرا می‌شود.

## متغیرهای محیطی

| متغیر | پیش‌فرض | توضیح |
| --- | --- | --- |
| `PORT` | `3000` | پورت سرور |

می‌توانید با کپی‌کردن `.env.example` به `.env` آن‌ها را تنظیم کنید.

## API

| روش | مسیر | توضیح |
| --- | --- | --- |
| `GET` | `/api` | اطلاعات API و فهرست endpoint‌ها |
| `GET` | `/api/health` | بررسی سلامت سرور |
