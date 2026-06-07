# Hướng dẫn Deploy Dự Án

## Cách 1: Frontend (Netlify) + Backend (Railway) + Database (Railway MySQL)

### Bước 1: Deploy Backend lên Railway

1. **Tạo tài khoản Railway**
   - Truy cập: https://railway.app
   - Đăng ký và đăng nhập

2. **Tạo project mới**
   - Click "New Project" → "Deploy from GitHub repo"
   - Kết nối GitHub repository của bạn
   - Railway sẽ tự động detect dự án Node.js

3. **Cấu hình Backend**
   - Trong Railway, chọn service backend
   - Cấu hình:
     - **Root Directory**: `src/backend`
     - **Build Command**: `npm install`
     - **Start Command**: `ts-node index.ts` hoặc `node dist/index.js`

4. **Thêm Environment Variables**
   Trong Railway → Variables, thêm:
   ```
   PORT=5000
   DB_HOST=<Railway MySQL host>
   DB_PORT=3306
   DB_USER=<Railway MySQL user>
   DB_PASSWORD=<Railway MySQL password>
   DB_NAME=<Railway MySQL database name>
   JWT_SECRET=<your-secret-key>
   GMAIL_EMAIL=<your-gmail>
   GMAIL_APP_PASSWORD=<your-app-password>
   GEMINI_API_KEY=<your-gemini-key>
   LLM_PROVIDER=gemini
   ```

5. **Tạo Database trên Railway**
   - Trong project Railway, click "New Service" → "Database" → "MySQL"
   - Railway sẽ tạo database MySQL
   - Copy connection string từ tab "Variables"

6. **Chạy migration**
   - Railway không tự chạy init.sql, bạn cần:
     - Vào Railway Console
     - Chạy lệnh SQL từ file `src/backend/database/init.sql`

7. **Lấy URL Backend**
   - Railway sẽ cung cấp URL như: `https://your-app.railway.app`
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
     REACT_APP_API_URL=https://your-backend.railway.app
     ```

4. **Cập nhật API URL trong code**
   - Trong file `src/config/config.ts` hoặc tương tự
   - Thay đổi base URL từ `http://localhost:5000` thành URL Railway
   - Hoặc dùng environment variable: `process.env.REACT_APP_API_URL`

### Bước 3: Cập nhật Frontend để gọi Backend Railway

1. **Tìm file cấu hình API**
   - Tìm file có base URL backend (thường trong `src/services/` hoặc `src/config/`)

2. **Thay đổi URL**
   ```typescript
   // Trước
   const BASE_URL = 'http://localhost:5000';
   
   // Sau
   const BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend.railway.app';
   ```

3. **Rebuild và Redeploy**
   - Push code lên GitHub
   - Netlify sẽ tự động redeploy

### Bước 4: Test

1. **Test Backend**
   - Truy cập: `https://your-backend.railway.app/api/database/health`
   - Should return: `{"success": true, "message": "Database connection successful"}`

2. **Test Frontend**
   - Truy cập: `https://your-frontend.netlify.app`
   - Test đăng nhập, đăng ký, chat AI

## Lưu ý quan trọng

- **CORS**: Backend cần cấu hình CORS cho phép frontend domain
- **Environment Variables**: Không bao giờ commit file `.env` lên GitHub
- **Database**: Railway MySQL có giới hạn dung lượng, nên monitor thường xuyên
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

- **Railway**: $5/tháng cho starter plan (có free trial)
- **Netlify**: Free cho personal sites
- **MySQL Railway**: Tính theo dung lượng (free tier có sẵn)
