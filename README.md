# Nightlife Coordination App
App made using NodeJS, ExpressJS, PassportJS and MongoDB.

## User stories
From: https://www.freecodecamp.com/challenges/build-a-nightlife-coordination-app
- As an unauthenticated user, I can view all bars in my area.
- As an authenticated user, I can add myself to a bar to indicate I am going there tonight.
- As an authenticated user, I can remove myself from a bar if I no longer want to go there.
- As an unauthenticated user, when I login I should not have to search again.

## Deploying
1. `git clone https://github.com/paulotokimatu/fcc-nightlife-coordination.git`
2. `cd fcc-nightlife-coordination`
3. `npm install`
4. Set up .env file with DB path, SESSION_SECRET (random string), TWITTER_KEY (for Twitter authentication),
TWITTER_SECRET (for Twitter authentication), TWITTER_CB_URL (the url of your application + "/auth/twitter/callback"),
YELP_ID (from YELP API) and YELP_SECRET (from YELP API).
5. `node app.js`