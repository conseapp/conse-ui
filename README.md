

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

## done

* player shouldn't see the voting icons before finishing the game **done**

* let user see his/her profile without having group **done**

* adding set expire button for god. **done**

* disable reserve button if event is locked. **done**

## ingoing

* 1 - player MUST not be able to vote twice **couldn't be done now**

* 2 - god can't see his/her event????

* 3 - only god can see his/her own deck, other gods can't see 

* 4 - player MUST not be able to reserve event after event expiration time

* 5 - OTP login

* some UI edits ------ **NEED TALKS**

## NOT IN MVP

* add last move card panel ------ **NOT IN MVP**

* game history ------ **NOT IN MVP**

* portal ------ **NOT IN MVP**

* FFP ------ **NOT IN MVP**
