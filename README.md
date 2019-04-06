# Leandoo Menu Mailer

This little script fetches the menu plan from [Leandoo](https://leandoo.com/) and sends an
email with the pdf as attachment.

## Usage

```bash
# Install needed packages
sudo apt-get install gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

# Install node dependencies
yarn

# Start script
SENDGRID_API_KEY=<SENDGRID_API_KEY> LEANDOO_LOGIN=<LOGIN_EMAIL> LEANDOO_PASSWORD=<LOGIN_PASSWORD> yarn start
```
