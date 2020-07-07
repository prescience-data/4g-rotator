# A simple remote 4G rotator script

### What it does

This package allows a user to autoconnect to USB tethering and cycle an Android phones flight mode using cloud messages. Not root required.

You can run this script manually just by calling the `Renew.sh` shortcut, or build it into a Puppeteer script to autorenew IPs.

### What you need

1. A clean 4g capable Android phone (ie not the one you use day to day) to avoid any identity leaks. Does not require root.
2. A clean Google account not used for anything else to receive cloud messages.
3. Automate app https://play.google.com/store/apps/details?id=com.llamalab.automate
4. Ability to run bash scripts on your PC (ie install MinTTY or https://gitforwindows.org/) if you just want to use the shortcut script.
5. Node https://nodejs.org/en/download/


### Installation

##### Automate / Android
1. Set your `"Toggle Flight Mode"` quick access icon to the first icon on your pull down list. 
![Set Dropdown](https://github.com/prescience-data/4g-rotator/blob/master/Doc/flight-mode.jpg?raw=true)
2. Copy the two `.flo` scripts to your phone.
    (Note you might need to edit the Flow in step `19` & `43` (as per PDF) if your language pack calls Flight Mode something like `"Airplane Mode"` or `"Aeroplane Mode"` etc)
3. In step `42` (as per PDF) `"Cloud Receive"`, set the account to your clean Google account.
4. Disable phone Wifi and start the Flow on your phone. After the flow is started you can exit Automate and it will stay running.

##### Node
1. Run `npm install` in the `./Router` directory to install dependencies. 
2. Generage a "secret" for this google account from https://llamalab.com/automate/cloud/
3. Add this "secret" to `config.json` file along with your clean Google address.

##### Windows
1. Run the `Renew.sh` shortcut script and watch your phone renew its IP!

### Recommendations

I also recommend enabling the Auto Tether via USB script to avoid having to manually enable USB tethering each time you plug it in as a USB modem.

Additionally, although you can use this via Wifi tethering, it's quite a bit more complicated to manage this in a Node script, but it is possible. 

To avoid data excess, disable your phones auto update over 4g and set to only update over Wifi.


### Running Remotely 

Let's say you need to access 4G IPs in a different country... 

Just install this package on a cheap headless nano PC such as an Intel Compute Stick https://www.intel.com/content/www/us/en/products/boards-kits/compute-stick.html and install WireGuard https://www.wireguard.com along with our local 3Proxy script https://github.com/prescience-data/3proxy-config

The optimal solution is to connect the Compute Stick to wifi (which WireGuard will use to connect in) and proxy connections out via 4G USB tethering to avoid congestion, but it is possible to go in and out via the same 4G provided you have enough bandwidth.

You can install some remote management software such as AnyDesk to remote into the headless PC whenever you need to fix or install something provided it remains connected to local internet. 


