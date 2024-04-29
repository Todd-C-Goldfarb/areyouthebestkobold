### Are You the Best Kobold?
![GoldHoardIdle](https://github.com/Todd-C-Goldfarb/areyouthebestkobold/assets/132838573/ab82328a-9b69-4fcd-b622-6ac4c0a6ca29)

https://www.areyouthebestkobold.com

This website is a small side project showcasing full-stack development. It utilizes React for the frontend, Flask (Python) for the backend, Websockets, and Google Cloud Platform.
The idea is pretty simple -- as a Kobold, can you contribute the most amount of gold to the Dragon Hoard?
When a gold coin is added by a user, a websocket broadcast is sent out to show that user's real-time contribution to all other current users. Try it!

**PASSWORDS CANNOT BE RECOVERED, AND ARE IMMEDIATELY ENCRYPTED USING BCRYPT AND NEVER SENT IN RAW FORMAT**
**NOT EVEN I WANT ACCESS TO YOUR PASSWORD!**

![SleepingKobold](https://github.com/Todd-C-Goldfarb/areyouthebestkobold/assets/132838573/dcb01f3a-a399-4643-a6c8-7c532c0d3326)

## Building the Project

To build the project, clone the repository and make sure you have the latest **npm** and **pip**.
**requirements.txt** contains all of the required dependencies, install the requirements.txt using pip.
When the project has the required dependencies, you can run **npm start** to test the site on localhost:3000

If you want to contribute, feel free! The branches are protected, so make a pull request and I will review it.

![Basic_Kobold_Running_Coin](https://github.com/Todd-C-Goldfarb/areyouthebestkobold/assets/132838573/41400e3c-69ac-4c5a-9669-c3b55f9c039e)

## To-Do (At Some Point)
- Migrate the environment to Python 3.11, as GAE Flex is going to deprecate <3.11.
- Optimize the site for mobile layouts.
- Account Kobold Customization
- Highlight/Showcase the #1 Kobold
- Add a throwing animation and more statistics.
- Add a mechanic related to (stealing from the hoard?)
