

# Development on VPS

```console
sudo pm2 start npm --name "conse-ui" -- run dev
```

# Production on VPS
```console
sudo npm run build && sudo pm2 start npm --name "conse-ui" -- start
```
