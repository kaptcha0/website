---
title: A VPN Saved My Network
subtitle: How having a remote access can help resolve issues
description:
published: true
date: 2026-05-18
tags:
  - banter
  - storytime
  - vpn
  - homelab
---
Okay, picture this. You're away from home, enjoying your day, watching the birds flutter above as you wait to catch a bus. It's early, the roads are calm, and you're just barely awake. As you enjoy your music and try to stir yourself awake, you get a message. "J'C, the internet isn't working. Can you fix it?"

This is a true story. I was on my way to my college campus, waiting for my bus, and out of the blue, I got that text from a member of my household. Now, my family is not very technologically inclined. As such, I've become the "IT Guy" for everything and anything you can imagine. So naturally, whenever the internet doesn't work, I'm the guy they call. This was an especially pressing matter because they work remotely. In this case, no internet = no work. So I had to figure out how to get it back up and running while being an hour away.

## step 1. ISP status

My first train of thought was that there was some sort of outage, whether with power or the ISP. I had remembered that the night before, there was a random power outage for a couple of seconds, so I thought that something similar might have happened and it was taking a while for the router to get back online. However, after confirming with the person on-prem that this wasn't the case, I moved on to looking at the ISP status.

My ISP has a tool that allows you to check for outages in your area. I typed in my home zip code, and they reported no issues at all. I double checked this using [DownDetector](https://downdetector.com/) to see if any users had reported any issues. They also reported no problems.

To me, this meant that the issue was with my own networking infrastructure, not any of my providers.

## step 2. remote network access

If I was on-prem, this would've been simple. I would've had direct access to my Proxmox host, DHCP and DNS server, and my router. However, I wasn't, so I was panicking for a little bit. Then I remembered that I had a secret weapon under my sleeve.

A while before this whole ordeal even started, I had set up a mesh VPN service inside my homelab called [Netbird](https://netbird.io/) . It's free, open-source, and you can even self-host the entire stack, if you so desire. My goal was to be able to have access to my NAS and other services I'd be running on my homelab from anywhere in the world, and that's all I had been using it for up until this point. Now, though, this was going to be my saving grace.

I couldn't pull out my laptop, since I was at a bus stop, but luckily, I had a terminal app installed on my phone. And so, I connected to Netbird, enabled my home network as a route, and proceeded to do normal troubleshooting things.

## step 3. troubleshooting
I took the following steps:

1. SSH into my Netbird host and run a ping test to see if I can access my router, which was successful
2. Ping other IP addresses on my network, to see if I can access them, which was successful
3. Access the router dashboard, which showed me that uplink and downlink were working fine
4. SSH into my Netbird host and try to ping `1.1.1.1` , which worked
5. SSH into my Netbird host and try to ping `google.com` using my DNS server, which failed

This showed me that the issues was probably my DNS server.

## step 4. immediate fix

I was running Adguard Home in an LXC container on Proxmox as both a DHCP and DNS server. I had noticed a while back that after a while, the server would randomly stop responding, and I would have to restart it for it to be operational again. Since my goal at that moment was getting the network back online, I rebooted the instance. Sure enough, this resolved the issue, and my network was completely operational once again.

I told my household that the internet should be back up again. They tried it, and confirmed that this was true, and thanked me.

## step 5. remediation

While this was enough for the moment, I decided that I didn't want to have to go through this again. Once I got back home, I got down to business and tried to figure out why the problem happened and what I can do to make sure it doesn't repeat itself.

After doing some digging, I realized that the Adguard LXC's storage was almost completely full. Everything else looked fine—there were no errors in the Proxmox logs, resource utilization was low on both the host and the container, and there was nothing in the Adguard logs. This led me to believe that this full storage was probably the problem.

After digging into Adguard's settings, I realized that I had set the query log and statistics retention to 90 days. Realistically, I didn't need logs for that long, so I reduced it to 7 days. That cleared up good bit of space, dropping the disk utilization from 90% to 20%. Ever since then, I've never seen the issue pop back up again, so I'd say problem was resolved.

## conclusion

Honestly, I don't know what I would've done if I didn't have Netbird up and running. Like I said, my family isn't very technologically inclined, so I couldn't expect or ask them to do the troubleshooting that I did, even if I fed them commands.

But this just goes to show that over-preparation is often better than just doing the bare minimum. I built my homelab to be as close to an industrial, commercial networking closet as I can get with consumer-grade gear. Every decision I've made trying as much as I can to get to that level. This incident just proves how much it paid off. Now I know my system works, and I likely ready to take on whatever issue comes my way.