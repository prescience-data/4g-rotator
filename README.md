# A simple remote 4G rotator script

#### What it does

This package allows a user to autoconnect to USB tethering and cycle an Android phones flight mode using cloud messages. Not root required.

#### What you need

1. A clean 4g capable Android phone (ie not the one you use day to day) to avoid any identity leaks. Does not require root.
2. A clean Google account not used for anything else to receive cloud messages.
3. Automate app https://play.google.com/store/apps/details?id=com.llamalab.automate
4. Ability to run bash scripts on your PC (ie install MinTTY or https://gitforwindows.org/) if you just want to use the shortcut script.
5. Node https://nodejs.org/en/download/
6. To avoid data excess, disable your phones auto update over 4g and set to only update over Wifi.

### Installation

1. Copy the two flo scripts to your phone.
2. Set your "Toggle Flight Mode" quick access icon to the first icon on your pull down list. (Note you might need to edit the Flow in step 19 & 43 (as per PDF) if your language pack calls Flight Mode something like "Airplane Mode" or "Aeroplane Mode" etc)
3. In step 42 (as per PDF) "Cloud Receive", set the account to your clean Google account.
4. Generage a "secret" for this google account from https://llamalab.com/automate/cloud/
5. Add this "secret" to the Node script.
6. Enable the Flow on your phone and disable wifi.
7. Run the shortcut script and watch your phone renew its IP!


### Recommendations

I also recommend enabling the Auto Tether via USB script to avoid having to manually enable USB tethering each time you plug it in as a USB modem.

Additionally, although you can use this via Wifi tethering, it's quite a bit more complicated to manage this in a Node script, but it is possible. 

