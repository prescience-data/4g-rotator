# A simple remote 4G rotator script

### What it does

This package allows a user to cycle an Android phones flight mode using Automate app and cloud messages. The result is automated 4G IP renewal. Not root required.

You can run this script manually just by calling the `Renew.sh` shortcut, or build it into any Node / Puppeteer script to autorenew IPs.

### What you need

1. A clean 4G capable Android phone (ie ideally not the one you use day to day to avoid any identity leaks). Does not require root.
2. A clean Google account not used for anything else to receive cloud messages.
3. Automate app https://play.google.com/store/apps/details?id=com.llamalab.automate
4. Node https://nodejs.org/en/download


### Installation

##### Automate / Android
1. Set your `"Toggle Flight Mode"` quick access icon to the first icon on your pull down list. 
![Set Dropdown](https://github.com/prescience-data/4g-rotator/blob/master/Doc/flight-mode.jpg?raw=true)
2. Copy the two `.flo` scripts to your phone.
    (Note you might need to edit the Flow in step `19` & `43` *([as per PDF](https://github.com/prescience-data/4g-rotator/blob/master/Flows/Toggle%20Flight%20Mode.pdf))* if your language pack calls Flight Mode something like `"Airplane Mode"` or `"Aeroplane Mode"` etc)
3. In step `42` *([as per PDF](https://github.com/prescience-data/4g-rotator/blob/master/Flows/Toggle%20Flight%20Mode.pdf))* `"Cloud Receive"`, set the account to your clean Google account.
4. Disable phone Wifi and start the Flow on your phone. After the flow is started you can exit Automate and it will stay running.

##### Node
1. Run `npm install` in the `./Router` directory to install dependencies. 
2. Generage a "secret" for your clean Google account from https://llamalab.com/automate/cloud
3. Add this "secret" to `config.json` file along with your clean Google address.

##### Windows
1. Run the `Renew.sh` / `Renew.bat` shortcut script and watch your phone renew its IP! (See quick video demo here: https://youtu.be/rbMXmME2TRs) 
Or alternatively integrate with your existing Node/Puppeteer automations.

![Example](https://github.com/prescience-data/4g-rotator/blob/master/Doc/demo.jpg?raw=true)

### Recommendations

Recommend enabling the `Auto Tether` flow on the handset to avoid having to manually enable USB tethering each time you plug it in as a USB modem.

Additionally, you can use this via Wifi Tethering, although it's quite a bit more complicated / less reliable to manage this in a Node script. 

To avoid data excess, disable your phones auto update over 4G and set to only update over Wifi.


### Taking It Further / Running Remotely / Offshore 

But what if you need to access 4G IPs in a different country?

##### Requirements
* A cheap headless nano-PC such as an Intel Compute Stick https://www.intel.com/content/www/us/en/products/boards-kits/compute-stick.html 
* WireGuard https://www.wireguard.com
* 3Proxy with Our local SOCKS5 config https://github.com/prescience-data/3proxy-config

##### Steps
1. Just install this package on the headless PC along with WireGuard (as listener) and 3Proxy.
2. Install the 3proxy config to create a local SOCKS5 proxy and install as a service.
3. Setup WireGuard VPN as a client instance on your regular PC.
4. VPN to the headless PC and you'll have access to its SOCKS5 proxy!

The optimal solution is to connect the Compute Stick to wifi (which WireGuard will use to connect in) and proxy connections out via 4G USB tethering to avoid congestion, but it is possible to go in and out via the same 4G provided you have enough bandwidth.

You can install some remote management software such as AnyDesk to remote into the headless PC whenever you need to fix or install something provided it remains connected to local internet. 


### Demo

When configured correctly, the package should run like this:

https://youtu.be/rbMXmME2TRs

