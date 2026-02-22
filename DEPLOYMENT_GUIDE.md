# HAWK Construction - Deployment Guide (cPanel)

This guide provides step-by-step instructions to deploy your Frontend (React + Vite) and Backend (.NET Core) to a cPanel hosting environment.

---

## 🚀 1. Preparing the Frontend (React + Vite)

### Step 1: Update Environment Variables
Open the `.env` file in the root directory and change `VITE_API_BASE_URL` to your production domain:
```env
VITE_API_BASE_URL=https://yourdomain.com/api
```

### Step 2: Build the Project
Run the building command in your terminal:
```bash
npm run build
```
This will create a `dist` folder.

### Step 3: Upload to cPanel
1.  Log in to cPanel and open **File Manager**.
2.  Go to `public_html`.
3.  Upload all files inside the `dist` folder directly into `public_html`.
4.  Ensure the `.htaccess` file (already created in your `public` folder) is also in `public_html`. This handles internal routing so pages don't 404 on refresh.

---

## 🛠️ 2. Preparing the Backend (.NET Core)

### Step 1: Production Settings
Update the `HAWK-master/HAWK/appsettings.json` with your production details:
- **ConnectionStrings**: Update `DefaultConnection` with your hosting's SQL Server details.
- **Jwt Key**: Ensure you use a strong, private key for production.

### Step 2: Publish the Backend
In your terminal (inside `HAWK-master/HAWK`), run:
```bash
dotnet publish -c Release -o ./publish
```
This will create a `publish` folder with all required DLLs and configuration files.

### Step 3: Hosting on cPanel
Most cPanel hosts run Linux. To host .NET Core on cPanel Linux:
1.  Use the **"Setup Python App"** or **"Setup Node.js App"** equivalents if your host supports **Phusion Passenger** for .NET.
2.  If your host provides **Windows Hosting (Plesk)**, simply upload the `publish` folder to your site's root.
3.  **Permissions**: Ensure the `server/` directory in your backend folder has **Write Permissions** so users can upload images.

---

## 🗄️ 3. Database Deployment

1.  Open your hosting's **Database Manager** (SQL Server).
2.  Create a new database named `HAWK`.
3.  If your hosting allows **.bak** restoration, use the `HAWK.bak` file in the root directory.
4.  Alternatively, you can run migrations from your local laptop to the remote database:
    ```bash
    dotnet ef database update --connection "Your_Production_Connection_String"
    ```

---

## ✅ Final Checklist
- [ ] Frontend `.env` points to `https://yourdomain.com/api`.
- [ ] Backend `appsettings.json` has the correct production database string.
- [ ] `.htaccess` is present in `public_html`.
- [ ] The `server/` folder exists in the backend directory for uploads.
