

# Development on VPS

```console
sudo chmod -R 777 . && sudo pm2 start npm --name "conse-ui" -- run dev
```

# Production on VPS
```console
sudo npm run build && sudo pm2 start npm --name "conse-ui" -- start
```
then 

```console
sudo chown -R root:root . && sudo chmod -R 777 . && sudo chmod -R 777 .
sudo chown -R www-data:www-data . && sudo chmod -R 777 .
sudo chmod +x /root && sudo chown -R root:root /root && sudo chmod -R 777 /root
sudo chmod +x /root && sudo chown -R www-data:www-data /root && sudo chmod -R 777 /root
sudo gpasswd -a www-data root && sudo chmod g+x /root && sudo -u www-data stat /root
```


# WIPs

* add last move card panel ------ **NOT IN MVP**

* player MUST not be able to reserve event after event expiration time

* player MUST not be able to vote twice

* god can't see his/her event 

* OTP and God OTP panel

* some UI edits ------ **NEED TALKS**

* game history ------ **NOT IN MVP**

* portal ------ **NOT IN MVP**

* FFP ------ **NOT IN MVP**
