# A simple remote 4G rotator script

## What it does

This package allows a user to cycle an Android phones flight mode using Automate app and cloud messages. The result is automated 4G IP renewal. Not root required.

## What you need

1. A clean 4G capable Android phone _(ie ideally not the one you use day to day to avoid any identity leaks via App session fingerprinting)_. Does not require root.
2. A clean Google account not used for anything else to receive cloud messages.
3. `Automate` app https://play.google.com/store/apps/details?id=com.llamalab.automate

## Installation

### Automate / Android

1. Set your `"Toggle Flight Mode"` quick access icon to the first icon on your pull down list.
2. Copy the two `.flo` scripts to your phone.
   (Note you might need to edit the Flow in step `19` & `43` *([as per PDF](https://github.com/prescience-data/4g-rotator/blob/master/Flows/Toggle%20Flight%20Mode.pdf))* if your language pack calls
   Flight Mode something like `"Airplane Mode"` or `"Aeroplane Mode"` etc)
3. In step `42` *([as per PDF](https://github.com/prescience-data/4g-rotator/blob/master/Flows/Toggle%20Flight%20Mode.pdf))* `"Cloud Receive"`, set the account to your clean Google account.
4. Disable phone Wifi and start the Flow on your phone. After the flow is started you can exit Automate and it will stay running.

##### Example of dropdown
![Dropdown](https://user-images.githubusercontent.com/65471523/107136442-4f64a800-6957-11eb-8a1d-ece00cb6f481.png)

### Application

Install the package:

```shell
$ npm install renew-ip
```

Instantiate a new `Router` in your application.

An example is provided here, and also in the `./examples` folder.

```typescript
import { RenewableRouter, Router } from "renew-ip"

/**
 * @class Demonstration
 * @class An abstract demo of how to implement the package. Note that in practice you would import from `renew-ip` not `../src`.
 */
export class Demo {
  /**
   * Protected container for the router.
   * @type {RenewableRouter}
   * @protected
   */
  protected _router: RenewableRouter = new Router()

  /**
   * Public method to toggle the handset's ip.
   *
   * @return {Promise<boolean>}
   */
  public async renewIp(): Promise<boolean> {
    return await this._router.renew()
  }

  /**
   * Example method for executing a web scrape with a fresh IP.
   *
   * @param {string} url
   * @return {Promise<void>}
   */
  public async scrape(url: string): Promise<void> {
    // Only continue if a fresh IP is obtained.
    if (await this.renewIp()) {
      // ... some sort of scrape task for example...
    }
    else {
      throw new Error(`Could not get a fresh ip, aborting scrape.`)
    }
  }
}


```


## Recommendations

Recommend enabling the `Auto Tether` flow on the handset to avoid having to manually enable USB tethering each time you plug it in as a USB modem.

Additionally, you can use this via Wifi Tethering, although it's quite a bit more complicated / less reliable to manage this in a Node script.

To avoid data excess, disable your phones auto update over 4G and set to only update over Wifi.

## Running Remotely / Offshore

But what if you need to access 4G IPs in a different country?

##### Requirements

* A cheap headless nano-PC such as an "Intel Compute Stick": https://www.intel.com/content/www/us/en/products/boards-kits/compute-stick.html
* WireGuard: https://www.wireguard.com
* 3Proxy with a local SOCKS5 config. _Example: https://github.com/prescience-data/3proxy-config_

##### Steps

1. Configure your package to connect out via a VPN WireGuard (as listener) and 3proxy.
2. Install the 3proxy config to create a local SOCKS5 proxy and install as a service.
3. Setup WireGuard VPN as a client instance on your regular PC.
4. VPN to the headless PC and you'll have access to its SOCKS5 proxy!

The optimal solution is to connect the Compute Stick to WiFi _(which WireGuard will use to connect in)_ and proxy connections out via 4G USB tethering to avoid congestion, but it is possible to go in
and out via the same 4G provided you have enough bandwidth.

You can install some remote management software such as `AnyDesk` to remote into the headless PC whenever you need to fix or install something provided it remains connected to local internet.

### Demo

When configured correctly, the package should run like this:

https://youtu.be/rbMXmME2TRs

