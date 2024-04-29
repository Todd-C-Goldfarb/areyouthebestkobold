import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';


import './Main.css';

function Main({ setWebState, currentUsername, currentCoinCount, setCurrentCoinCount }) {

    const [addCoinButtonDisabled, setAddCoinButtonDisabled] = useState(false);
    const [hoardCount, setHoardCount] = useState(-1);
    const [top5Info, setTop5Info] = useState([]);


    // ------------ CONTRIBUTION -----------------
    const AddCoinButtonClicked = async () => {
        if (addCoinButtonDisabled) return;

        // Four things must occur:
        // - Show the animation of user's kobold throwing a coin in.
        ShowUserKoboldAddStart();

        // - Start the countdown and disable the button for the countdown (while animation finishes)
        setAddCoinButtonDisabled(true);
        setTimeout(() => {
            setAddCoinButtonDisabled(false);
        }, 4000);

        // - Increment the local coin count
        setCurrentCoinCount(currentCoinCount + 1);

        // - Call the AddCoin API
        try {
            const response = await fetch(`https://kobold-website-421221.wl.r.appspot.com/kobolds/${currentUsername}/AddCoin`, {
                method: 'PUT'
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Coin added successfully:', data);
            } else {
                throw new Error(data.Error || 'Failed to add coin');
            }
        } catch (error) {
            console.error('Error adding coin:', error);
            // Revert the coin count if the API call fails
            setCurrentCoinCount(currentCoinCount - 1);
        }

    }

    const ShowUserKoboldAddStart = () => {
        // SHOWS THE USER's KOBOLD ADDING A COIN
        const userKoboldWrapper = document.createElement("div");
        userKoboldWrapper.classList.add('koboldWrapper');

        // CREATE THE USER TAG AND APPEND
        const userTag = document.createElement("div");
        userTag.innerHTML = currentUsername;
        userTag.classList.add('koboldUserTag');
        userKoboldWrapper.appendChild(userTag);

        // CREATE THE IMG TAG AND APPEND
        const koboldImage = document.createElement("img");
        koboldImage.src = "sprites/Basic_Kobold_Running_Coin.gif";
        koboldImage.classList.add('koboldImageTag');
        userKoboldWrapper.appendChild(koboldImage);

        // ADD THE WRAPPER TO THE USERCONTAINER
        document.getElementById('userContainer').appendChild(userKoboldWrapper);

        // ADD THE ANIMATION CLASS TO THE WRAPPER
        userKoboldWrapper.classList.add('animateUserContributionStart');


        // CALL THE "RETURN ANIMATION"
        setTimeout(() => {
            ShowUserKoboldAddEnd(userKoboldWrapper, koboldImage);
        }, 2000);
    }

    const ShowUserKoboldAddEnd = (userKoboldWrapper, koboldImage) => {
        // CHANGE THE SPRITE (NO MORE COIN)
        koboldImage.src = "sprites/Basic_Kobold_Running_NoCoin.gif";
        koboldImage.classList.add('flipImage');

        // CHANGE ANIMATION TO RETURN OFFSCREEN
        userKoboldWrapper.classList.add('animateUserContributionEnd');

        setTimeout(() => {
            userKoboldWrapper.remove();
        }, 2000);
    }

    // ------------ ONLINE -----------------

    const ShowOnlineKoboldAddStart = (username) => {
        // Don't show your own kobold!
        if (username === currentUsername) return;

        // SHOWS THE USER's KOBOLD ADDING A COIN
        const onlineKoboldWrapper = document.createElement("div");
        onlineKoboldWrapper.classList.add('koboldWrapper');

        // CREATE THE USER TAG AND APPEND
        const userTag = document.createElement("div");
        userTag.innerHTML = username;
        userTag.classList.add('koboldUserTag');
        onlineKoboldWrapper.appendChild(userTag);

        // CREATE THE IMG TAG AND APPEND
        const koboldImage = document.createElement("img");
        koboldImage.src = "sprites/Basic_Kobold_Running_Coin.gif";
        koboldImage.classList.add('koboldImageTag');
        koboldImage.classList.add('flipImage');
        onlineKoboldWrapper.appendChild(koboldImage);

        // ADD THE WRAPPER TO THE USERCONTAINER
        document.getElementById('onlineContainer').appendChild(onlineKoboldWrapper);

        // ADD THE ANIMATION CLASS TO THE WRAPPER
        onlineKoboldWrapper.classList.add('animateOnlineContributionStart');


        // CALL THE "RETURN ANIMATION"
        setTimeout(() => {
            ShowOnlineKoboldAddEnd(onlineKoboldWrapper, koboldImage);
        }, 2000);
    }

    const ShowOnlineKoboldAddEnd = (onlineKoboldWrapper, koboldImage) => {
        // CHANGE THE SPRITE (NO MORE COIN)
        koboldImage.src = "sprites/Basic_Kobold_Running_NoCoin.gif";
        koboldImage.classList.add('unflipImage');

        // CHANGE ANIMATION TO RETURN OFFSCREEN
        onlineKoboldWrapper.classList.add('animateOnlineContributionEnd');

        setTimeout(() => {
            onlineKoboldWrapper.remove();
        }, 2000);
    }


    const setLeaderboardData = (data) => {
        // Add rows according to data!
        setTop5Info(data.map(kobold => ({
            username: kobold.username,
            coinCount: kobold.coin_count
        })));
    }

    const updateHoardCount = (data) => {
        setHoardCount(data['total']);
    }

    // THE KOBOLD NETWORK SOCKET & GRABBING LEADERBOARD
    useEffect(() => {
        // KOBOLD NETWORK
        const socket = io('https://kobold-website-421221.wl.r.appspot.com');

        socket.on('coin_added', (data) => {
            console.log('Coin added by:', data.username);
            ShowOnlineKoboldAddStart(data.username);
        });

        const fetchLeaderboardData = () => {
            fetch('https://kobold-website-421221.wl.r.appspot.com/kobolds/leaderboard')
                .then(response => response.json())
                .then(data => setLeaderboardData(data))
                .catch(error => console.error('Error fetching data:', error));
        };

        const fetchHoardCount = () => {
            fetch('https://kobold-website-421221.wl.r.appspot.com/TreasureHoard')
                .then(response => response.json())
                .then(data => updateHoardCount(data))
                .catch(error => console.error("Error fetching hoard count:", error));
        }

        fetchLeaderboardData();
        fetchHoardCount();

        // Update the leaderboard every 10sec
        const leaderboardIntervalID = setInterval(fetchLeaderboardData, 10000);
        const hoardIntervalID = setInterval(fetchHoardCount, 3000);

        return () => {
            socket.disconnect();
            clearInterval(leaderboardIntervalID);
            clearInterval(hoardIntervalID);
        };
    }, []);

    return (
        <div className="Main">

            {/* Developed by Todd Goldfarb */}
            {/* https://github.com/Todd-C-Goldfarb */}


            {/* Primary Container contains the animations */}
            <div className="primaryContainer" id="primaryContainer">

                {/* User Container shows the user's kobold, also does the animation when the AddCoin is pressed. */}
                <div className="userContainer" id="userContainer">

                </div>

                {/* Hoard Container shows the treasure hoard! */}
                <div className="hoardContainer" id="hoardContainer">
                    <img id="hoardAnimation" className="hoardAnimation" src="/sprites/GoldHoardIdle.gif"></img>
                </div>

                {/* Online Container shows all the others whenever they throw in a coin. */}
                <div className="onlineContainer" id="onlineContainer">

                </div>

            </div>



            {/* Info Container contains the self-statistics and the Leaderboards */}
            <div className="infoContainer" id="infoContainer">

                {/* Contribution Container holds both the AddCoin button and the player contribution number */}
                <div className='contributionContainer'>

                    <button className='addCoinButton' onClick={AddCoinButtonClicked}>Add Coin!</button>

                    <div className='contributionCount' id='contributionCount'>
                        You have contributed {currentCoinCount} coins!
                    </div>
                </div>

                {/* Statistics Container holds (% of hoard as your contribution, # of total kobolds, your superior kobold and underling kobold) */}
                <div className='statisticsContainer'>

                    <div className='hoardCount'><b>Hoard Count: {hoardCount} Coins!</b></div>
                </div>

                {/* Leaderboard Container holds the leaderboard of top 5 kobolds. */}
                <div className='leaderboardContainer'>
                    <div className='leaderboardTitle'><b>The Best Kobolds</b></div>

                    <div className="table">
                        <div className="row header">
                            <div className="cell">
                                Username
                            </div>
                            <div className="cell">
                                # of Coins
                            </div>
                        </div>
                        {top5Info.map((kobold, index) => (
                            <div key={index} className="row">
                                <div className="cell" data-title="Username">{kobold.username}</div>
                                <div className="cell" data-title="CoinCount">{kobold.coinCount}</div>
                            </div>
                        ))}
                    </div>

                </div>

            </div>



        </div >
    );
}

export default Main;