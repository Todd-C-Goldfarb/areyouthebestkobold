### Are You the Best Kobold?
<img src="public/sprites/GoldHoardIdle.gif" width="600" height="600" alt="A giant dragon!" style="image-rendering: pixelated;">

https://www.areyouthebestkobold.com

This website is a small side project showcasing full-stack development. It utilizes React for the frontend, Flask (Python) for the backend, Websockets, and Google Cloud Platform.
The idea is pretty simple -- as a Kobold, can you contribute the most amount of gold to the Dragon Hoard?
When a gold coin is added by a user, a websocket broadcast is sent out to show that user's real-time contribution to all other current users. Try it!

**PASSWORDS CANNOT BE RECOVERED, AND ARE IMMEDIATELY ENCRYPTED USING BCRYPT AND NEVER SENT IN RAW FORMAT**

**NOT EVEN I WANT ACCESS TO YOUR PASSWORD!**

<img src="public/sprites/SleepingKobold.gif" width="600" height="600" alt="A sleeping kobold." style="image-rendering: pixelated;">

## Building the Project

To build the project, clone the repository and make sure you have the latest **npm** and **pip**.
**requirements.txt** contains all of the required dependencies, install the requirements.txt using pip.
When the project has the required dependencies, you can run **npm start** to test the site on localhost:3000

If you want to contribute, feel free! The branches are protected, so make a pull request and I will review it.

<img src="public/sprites/Basic_Kobold_Running_Coin.gif" width="400" height="600" alt="A sleeping kobold." style="image-rendering: pixelated;">

## To-Do (At Some Point)
- Migrate the environment to Python 3.11, as GAE Flex is going to deprecate <3.11.
- Optimize the site for mobile layouts.
- Account Kobold Customization
- Highlight/Showcase the #1 Kobold
- Add a throwing animation and more statistics.
- Add a mechanic related to (stealing from the hoard?)
- Add a github action to immediately deploy to GAE flex after main update
