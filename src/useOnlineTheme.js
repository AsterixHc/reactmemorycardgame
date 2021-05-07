import { useEffect, useState } from "react";

function useOnlineTheme() {
    // Token used for accessing themes API.
    const [accessToken, setAccessToken] = useState(null);

    // The color codes fethed from API.
    const [colorCodes, setColorCodes] = useState(null);

    useEffect(() => {
        if (accessToken) return;

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        let urlencoded = new URLSearchParams();
        urlencoded.append("Client_Id", "c763b298-475d-434e-b6d9-b6c2b91dd71a");
        urlencoded.append("Client_Secret", "bda67075-bf22-4377-8e25-6304ff0136d0");
        urlencoded.append("grant_type", "client_credentials");

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded
        };

        fetch("https://identity.complianty.com/connect/token", requestOptions)
            .then(response => response.json())
            .then(json => setAccessToken(json.access_token))
            .catch(error => console.log('error', error));
    }, [accessToken]);

    console.log(accessToken); // TODO: Delete this when everything works.

    useEffect(() => {
        if (!accessToken) return;

        let myHeaders = new Headers();
        myHeaders.append("Authorization", ("Bearer " + accessToken));

        let requestOptions = {
            method: 'GET',
            headers: myHeaders
        };

        fetch("http://api.gateway.admin.complianty.com/Tenants/v1/112/Tenants/112", requestOptions)
            .then(response => response.json())
            .then(result => console.log(result)) // TODO: Get the 'theming' property of response and put it in colorCodes. (Again, when everything works)
            .catch(error => console.log('error', error));
    }, [accessToken]);

    return colorCodes;
}

export default useOnlineTheme;