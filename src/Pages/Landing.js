import React, { useState } from 'react';

import './Landing.css';

function Landing({ setWebState, setCurrentUsername, setCurrentCoinCount }) {

    // ALL STATE-HOOKS
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [createUsername, setCreateUsername] = useState('');
    const [createPassword, setCreatePassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [signupState, setSignupState] = useState('needUsername');

    // ------------- SIGNUP FUNCTIONALITY -------------
    // Signup has a few states.
    // There is the needUsername state, where the user still has to enter a valid username.
    //      - In this state, the password and submit button is hidden
    //
    // There is the needPassword state, where the user has entered a valid username but not password.
    //      - In this state, the submit button is Hidden
    //
    // Finally, there is the ready state, where the user has entered a valid username and password, ready to create an account.

    const handleCreate = async (event) => {
        // Prevent the form from causing a page reload
        event.preventDefault();

        if (!createUsername || !createPassword) {
            setSignupState('needUsername');
            setCreateUsername('');
            setCreatePassword('');
            ShowError(true, "You need to input both a username and a password to create an account!");
            return;
        }

        console.log('Create attempted with:', createUsername, createPassword);

        // Use the POST method to create a kobold account.
        try {
            const response = await fetch('/kobolds', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: createUsername,
                    password: createPassword
                })
            });

            if (!response.ok) {
                ShowError(true, "Failed to create the kobold account, please try again later.");
                return;
            }

            // THE ACCOUNT WAS CREATED SUCCESSFULLY
            SwitchToMain(createUsername, 0);


        } catch (error) {
            console.error('Failed to create Kobold account:', error);
            ShowError(true, "The network failed, try again later.");
        }
    };

    const handleCreateUsernameChange = (event) => {
        const newValue = event.target.value;
        const sanitizedValue = newValue.replace(/[^\w]/gi, '');
        setCreateUsername(sanitizedValue);

        // The username has been changed, for safety we need to set the signupState to needUsername
        // and we also need to clear the password field.
        setSignupState('needUsername');
        setCreatePassword('');
        ShowError(true, null);
    }

    const validateUsername = async () => {
        if (createUsername === "") {
            ShowError(true, "You must input a username!");
            return;
        }

        const isTaken = await checkUsernameIsTaken(createUsername);
        if (isTaken) {
            ShowError(true, "This username is already taken!");
            return;
        }
        else {
            ShowError(false, "This username is available! Choose a password.");

            // The username is valid, let the user select the password.
            setSignupState("needPassword");
            return;
        }
    }

    const checkUsernameIsTaken = async (username) => {
        try {
            let response = await fetch(`https://kobold-website-421221.wl.r.appspot.com/kobolds/${username}`);
            let jsonResponse = await response.json();
            return jsonResponse.isTaken;
        } catch (error) {
            console.error('Failed to fetch', error);
            ShowError(true, "The network failed, try again later.");
            return false;
        }
    }

    const handleCreatePasswordChange = (event) => {
        // UPDATE THE PASSWORD VALUE
        setCreatePassword(event.target.value);
        ShowError(false, "Do not enter a password that is commonly used!<br />There is no way to recover your password once it is lost.");
        setSignupState('ready');
    }


    const ShowError = (red, errorMessage) => {
        const errorBox = document.getElementById('errorBox');
        errorBox.classList.remove('errorMessage');

        // Is the text RED or GREEN?
        if (red) {
            errorBox.style.color = "red";
        }
        else {
            errorBox.style.color = "green";
        }

        // Does the message show at all?
        if (errorMessage) {
            errorBox.innerHTML = errorMessage;
            if (red) errorBox.classList.add('errorMessage');
            else errorBox.classList.remove('errorMessage');
        } else {
            errorBox.innerHTML = '';
            errorBox.classList.remove('errorMessage');
        }
    }

    // ------------- LOGIN FUNCTIONALITY -------------

    const handleLogin = async (event) => {
        event.preventDefault(); // Prevent the form from causing a page reload
        if (!loginUsername || !loginPassword) {
            ShowLoginError(true, "Please provide both a username and a password!");
            return;
        }
        console.log('Login attempted with:', loginUsername, loginPassword);

        const response = await fetch('https://kobold-website-421221.wl.r.appspot.com/kobolds/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: loginUsername,
                password: loginPassword,
            }),
        });

        if (response.ok) {
            // If login is successful, do something with the response data
            const data = await response.json();
            console.log('Login successful:', data);
            SwitchToMain(data['username'], data['coin_count']);
            return;
        } else {
            // If login fails, handle the error response
            const errorData = await response.json();
            console.error('Login failed:', errorData);
        }


        // IF LOGIN FAILS
        ShowLoginError(true, "An account with that username/password can not be found!");

        setLoginUsername('');
        setLoginPassword('');
    };

    // Example function to handle username change
    const handleLoginUsernameChange = (event) => {
        const newValue = event.target.value;
        const sanitizedValue = newValue.replace(/[^\w]/gi, '');
        setLoginUsername(sanitizedValue);
    };

    // Example function to handle password change
    const handleLoginPasswordChange = (event) => {
        setLoginPassword(event.target.value);
    };


    const ShowLoginError = (red, errorMessage) => {
        const loginErrorBox = document.getElementById('loginErrorBox');
        loginErrorBox.classList.remove('errorMessage');

        // Is the text RED or GREEN?
        if (red) {
            loginErrorBox.style.color = "red";
        }
        else {
            loginErrorBox.style.color = "green";
        }

        // Does the message show at all?
        if (errorMessage) {
            loginErrorBox.innerHTML = errorMessage;
            if (red) loginErrorBox.classList.add('errorMessage');
            else loginErrorBox.classList.remove('errorMessage');
        } else {
            loginErrorBox.innerHTML = '';
            loginErrorBox.classList.remove('errorMessage');
        }
    }



    // ------------- LEAVE LANDING -------------
    const SwitchToMain = (username, coin_count) => {
        // Assuming login and creation has worked, pass to Main.
        setCurrentUsername(username);
        setCurrentCoinCount(coin_count);
        setWebState("main");
    }


    return (
        <div className="Landing">

            {/* Developed by Todd Goldfarb */}
            {/* https://github.com/Todd-C-Goldfarb */}

            <div id="optionContainer" className="optionContainer">

                <div id="welcomeTitle" className="welcomeTitle">Are You the Best Kobold?</div>


                {/*  SIGNUP CONTAINER/FORM  */}

                <div id="createContainer" className="createContainer">

                    <div className="createHeader"><b>Create my Kobold</b><br /><i>(First Time?)</i></div>

                    <div className='createForm'>
                        <div className='createUsernameGroup'>
                            <input
                                type="text"
                                placeholder="Username"
                                value={createUsername}
                                onChange={handleCreateUsernameChange}
                                className="inputText"
                            />
                        </div>

                        {(signupState === "needPassword" || signupState === "ready") && <div className='createPasswordGroup'>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={createPassword}
                                onChange={handleCreatePasswordChange}
                                className="inputText"
                            />
                        </div>}
                        {(signupState === "needPassword" || signupState === "ready") && <button className="inputButton" onClick={() => setShowPassword(!showPassword)}>Show/Hide</button>}
                        {(signupState === "needUsername") && <button className="inputButton" onClick={validateUsername}>Check Username Availability</button>}
                        {(signupState === "ready") && <button className="inputButton" onClick={handleCreate}>Create Kobold</button>}

                        <div id="errorBox" className='errorBox'></div>
                    </div>
                </div>


                {/*  CENTER STRIP  */}

                <div id="koboldContainer" className="koboldContainer">
                    <img id="koboldAnimation" className="koboldAnimation" src="/sprites/SleepingKobold.gif">
                    </img>
                </div>

                {/*  LOGIN CONTAINER/FORM  */}

                <div id="loginContainer" className="loginContainer">

                    <div className="loginHeader"><b>Login my Kobold</b><br /><i>(Returning User?)</i></div>

                    <div className="loginForm">

                        <div className='createUsernameGroup'>
                            <input
                                type="text"
                                placeholder="Username"
                                value={loginUsername}
                                onChange={handleLoginUsernameChange}
                                className="inputText"
                            />
                        </div>

                        <div className='createPasswordGroup'>
                            <input
                                type="password"
                                placeholder="Password"
                                value={loginPassword}
                                onChange={handleLoginPasswordChange}
                                className="inputText"
                            />
                        </div>
                        <button type="submit" className="inputButton" onClick={handleLogin}>Log In</button>

                        <div id="loginErrorBox" className='loginErrorBox'></div>
                    </div>
                </div>

                {/* EXPLANATION TEXT */}

                <div className='explanationText'>
                    <i>Become the best kobold by adding the most gold to the treasure hoard!</i><br />
                    Implemented using React, Flask, and Websockets for real-time interactivity.
                </div>
            </div>
        </div >
    );
}

export default Landing;