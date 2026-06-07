# Hướng dẫn Deploy Dự Án

## Cách 1: Frontend (Netlify) + Backend (Render) + Database (Render PostgreSQL)

### Bước 1: Deploy Backend lên Render

1. **Tạo tài khoản Render**
   - Truy cập: https://render.com
   - Đăng ký bằng GitHub (đơn giản nhất)

2. **Tạo Web Service mới**
   - Đăng nhập xong, click **New** → **Web Service**
   - Chọn repository: **baitaplon123**
   - Click **Connect**

3. **Cấu hình Backend**
   Trong phần **Build & Deploy**, cấu hình:
   - **Root Directory**: `src/backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `ts-node index.ts`
   - Click **Create Web Service**

4. **Tạo Database trên Render**
   - Trong dashboard Render, click **New** → **Database**
   - Chọn **PostgreSQL** (miễn phí)
   - Đặt tên database (ví dụ: `student-management-db`)
   - Click **Create Database**

5. **Lấy Database Connection String**
   - Click vào database vừa tạo
   - Chọn tab **Info**
   - Copy **Internal Database URL** (dạng: `postgresql://user:password@host:port/database`)

6. **Chạy migration**
   - Trong database dashboard, click **Connect** → **External Connection**
   - Copy connection string
   - Dùng pgAdmin hoặc DBeaver để kết nối
   - Copy nội dung file `src/backend/database/init.sql`
   - Paste và chạy trong SQL editor

7. **Thêm Environment Variables**
   Trong Web Service dashboard:
   - Chọn tab **Environment**
   - Click **Add Environment Variable**
   - Thêm từng biến:

**BẮT BUỘC:**
```
PORT=5000
DATABASE_URL=<Render PostgreSQL connection string>
JWT_SECRET=student_management_secret_key_deploy
```

**TÙY CHỌN (để đầy đủ chức năng):**
```
GMAIL_EMAIL=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password
GEMINI_API_KEY=your_gemini_api_key
LLM_PROVIDER=gemini
```

8. **Lấy URL Backend**
   - Render sẽ cung cấp URL dạng: `https://your-app.onrender.com`
   - Copy URL này để cấu hình frontend

### Bước 2: Deploy Frontend lên Netlify

1. **Tạo tài khoản Netlify**
   - Truy cập: https://netlify.com
   - Đăng ký và đăng nhập

2. **Deploy từ GitHub**
   - Click "Add new site" → "Import an existing project"
   - Chọn GitHub repository
   - Cấu hình:
     - **Build command**: `yarn build`
     - **Publish directory**: `dist`
   - Click "Deploy site"

3. **Cấu hình Environment Variables trên Netlify**
   - Trong Netlify → Site settings → Environment variables
   - Thêm:
     ```
     UMI_APP_API_URL=https://your-backend.onrender.com
     ```

### Bước 3: Test

1. **Test Backend**
   - Truy cập: `https://your-backend.onrender.com/api/database/health`
   - Should return: `{"success": true, "message": "Database connection successful"}`

2. **Test Frontend**
   - Truy cập: `https://your-frontend.netlify.app`
   - Test đăng nhập, đăng ký, chat AI

## Lưu ý quan trọng

- **CORS**: Backend cần cấu hình CORS cho phép frontend domain
- **Environment Variables**: Không bao giờ commit file `.env` lên GitHub
- **Database**: Render PostgreSQL có giới hạn dung lượng, nên monitor thường xuyên
- **Backup**: Thường xuyên backup database

## Cấu hình CORS trong Backend

Trong file `src/backend/index.ts`, thêm:

```typescript
app.use(cors({
  origin: ['https://your-frontend.netlify.app', 'http://localhost:8000'],
  credentials: true
}));
```

## Chi phí

- **Render**: Free tier có sẵn (Web Service: 750 giờ/tháng, Database: 90 ngày)
- **Netlify**: Free cho personal sites
- **PostgreSQL Render**: Free tier có sẵn (90 ngày, sau đó $7/tháng)
