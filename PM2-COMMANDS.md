# PM2 常用命令

## 启动
> ⚠️ **`pm2 start` 必须在项目目录 `/root/projects/ziwei-app` 下执行**，否则找不到 `package.json`。

```bash
# 开发模式（热更新）
pm2 start npm --name "ziwei-app" -- run dev

# 生产模式（需先 npm run build）
pm2 start npm --name "ziwei-app" -- start
```

## 查看
```bash
pm2 list                  # 查看所有托管进程
pm2 logs                  # 实时查看所有进程日志
pm2 logs ziwei-app        # 只查看当前项目日志
pm2 logs --lines 50       # 查看最近 50 行
pm2 logs --lines 100      # 查看最近 100 行
```

> 按 `Ctrl+C` 退出日志查看。

## 管理
```bash
pm2 restart ziwei-app    # 重启
pm2 start ziwei-app      # 重新启动（暂停后）
```

## 停止 / 移除
```bash
pm2 stop ziwei-app       # 暂停进程（保留在 PM2 列表）
pm2 delete ziwei-app     # 停止并从 PM2 列表移除
```

## 开机自启（可选）
```bash
pm2 save              # 保存当前进程列表
pm2 startup           # 设置开机自动恢复
```

## 说明
- `-- run dev` → 执行 `npm run dev`
- `-- start` → 执行 `npm run start`
