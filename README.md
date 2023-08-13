

# 🛠️ Development on VPS

```console
sudo chmod -R 777 . && sudo pm2 start npm --name "conse-ui" -- run dev
```

# 🚀 Production on VPS
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

# ✅ Done by @JavadH0sseini

* player shouldn't see the voting icons before finishing the game **done**

* let user see his/her profile without having group **done**

* adding set expire button for god **done**

* disable reserve button if event is locked **done**

* player MUST not be able to reserve event after event expiration time **done**

* player MUST not be able to vote twice **done**

* changing pwa logos **done**

* proper size for conse logo **done**

* a separate input for selecting time of event **done**

* set event start time 5 mins later + current time **done**

* add gray color on expired events in explor **done**

* dot icon below the user pages **done**

* a separate page is needed for every role learning section like clicking on citizen roles button shows all the citizen roles **done**

* add search bar to the index learning page and single side learning page **done** 

* add single last move cards page **done**

* add role in create deck section must be based on sides **done**

* handling user navigation when hasn't logged in **done**
  
* logo for learning cards **done**

* explore page (metadata, card positions, title) **done**

* player profile (expired and reserved ones) **done**

* remove god reserved tabs **done**

* call get all god events in history page inside the god panel **done**

* remove god home page **done**

* home page (current event) **done**

* add role on current event of the user home page **done**

* create deck and event button position **done**

* OTP login **done**

* fix upsert event api issue **done**
 
# 🗓 Beta Release Feature

* portal
* ux update
* realtiming
* install recommend
* history and phases
* edit profile
* username as name
* god add group
* register new god with dev access 

* add last move card panel

* game history and phases (separate color for each player in-game-status like using gray for dead status)

* god panel and upload event image

* god assistant section 

* portal payment 

