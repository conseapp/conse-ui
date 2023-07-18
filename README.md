

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

* adding set expire button for god **done**

* disable reserve button if event is locked **done**

* player MUST not be able to reserve event after event expiration time **done**

* player MUST not be able to vote twice **done**

## ingoing

* 1 - OTP login **(MUST BE GIVEN)**

* 2 - pwa

* 3 - UI/UX edits
  * add gray color on expired events in explor
  * scroll to left/right hint for learning page
  * proper size for conse logo
  * logo for learning cards **(MUST BE GIVEN)** 
  * logo for explor events card background **(MUST BE GIVEN)**
  * a separate page is needed for every role learning section like clicking on citizen roles button shows all the citizen roles
  * set event start time 5 mins later + current time
  * a separate input for selecting time of event
  * separate color for each player in-game-status like using gray for dead status
  * add role in create deck section must be based on sides (UX mock or wireframe MUST BE GIVEN)

## Beta Release Feature

* add last move card panel

* game history

* god assistant section 

* portal

* move to react 
