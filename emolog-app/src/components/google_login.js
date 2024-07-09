import React, { useEffect } from 'react';

const GoogleLogin = () => {
    useEffect(() => {
        window.google.accounts.id.initialize({
            client_id: 'your-client-id.apps.googleusercontent.com',
            callback: handleCredentialResponse
        });
        // window.google.accounts.id.renderButton(
        //     document.getElementById('googleSignInButton'),
        //     { theme: 'outline', size: 'large' }
        // );
    }, []);

    const handleCredentialResponse = (response) => {
        console.log(response.credential);
    };

    return (
        <div id="googleSignInButton">
            <img
                src="./img/google.png"
                alt="Login with Google"
                onClick={GoogleLogin}
                style={{ cursor: 'pointer' }}
            />
        </div>
    );
};

export default GoogleLogin;
