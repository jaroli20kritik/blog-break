# 🚀 Blog Break - Deployment Guide

Congratulations on building your creative blog! To make your site accessible to the world for free, follow these simple steps using **GitHub**, **Render**, and **GitHub Pages**.

---

## 1. Push Your Code to GitHub 📂
1.  **Create a New Repo**: Go to [GitHub](https://github.com) and create a new repository called `blog-break`.
2.  **Initialize Git**: Open your terminal in the `blog-app` folder and run:
    ```bash
    git init
    git add .
    git commit -m "Initial commit for Global Deployment"
    ```
3.  **Publish**:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/blog-break.git
    git branch -M main
    git push -u origin main
    ```

---

## 2. Deploy your API (The Brain) to Render 🧠
This hosts your C# backend and SQLite database.
1.  Go to [Render.com](https://render.com) and sign up with GitHub.
2.  Click **New +** > **Web Service**.
3.  Connect your `blog-break` repository.
4.  **Settings**:
    *   **Environment**: `Docker` (or `Manual` if using dotnet).
    *   **Build Command**: `dotnet build`
    *   **Start Command**: `dotnet run --project BlogApi/BlogApi.csproj`
5.  **Important**: Once deployed, Render will give you a URL (e.g., `https://blog-break-api.onrender.com`).

---

## 3. Deploy your UI to GitHub Pages 🌐
This hosts your beautiful frontend.
1.  In your GitHub repo, go to **Settings** > **Pages**.
2.  Set the **Source** to "Deploy from a branch" and select `main` / `frontend`.
3.  **Wait**: GitHub will give you a link like `https://your-username.github.io/blog-break`.

---

## 4. Final Connection 🔌
Once you have your **Render URL**:
1.  Open `frontend/js/app.js` and `frontend/admin.html` locally.
2.  Update the `API_URL` with your live Render URL.
3.  Commit and Push again:
    ```bash
    git add .
    git commit -m "Update API URLs for production"
    git push
    ```

**Your site is now live! Anyone with the GitHub Pages link can view your blog.** 🌍📖
