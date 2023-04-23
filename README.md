

# Development on VPS

```console
sudo chmod -R 777 . && sudo pm2 start npm --name "conse-ui" -- run dev
```

# Production on VPS
```console
sudo chmod -R 777 . && sudo npm run build && sudo pm2 start npm --name "conse-ui" -- start
```


# WIP

* player MUST not be able to reserve event after event expiration time

* player MUST not be able to vote twice

* god can't see his/her event 
