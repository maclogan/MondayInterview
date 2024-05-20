This is a mono-repo for my Monday.com Coding Assessment containing the following applications:
- The graphql-server app handles the API and data storage for fragrances. This is built in Node.js utilizing Apollo Server and MongoDB.
- The APIInterface app is used on a Monday app that allows the user to create, edit, and delete fragrances from the data store. This is written in React with the Apollo Client and Vibe Design Kit.
- The OrderForm app is used on a Monday app that allows a user to create an order for a candle sample kit. It also has options to either pull the fragrance data from a Monday table or from the graphql-server.  This is written in React with the Apollo Client, monday SDK, and Vibe Design Kit.
