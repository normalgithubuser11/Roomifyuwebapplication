
  # RoomifyU web application

  This is a code bundle for RoomifyU web application. The original project is available at https://www.figma.com/design/gB20pK4v2X2nCq87NMrJkd/RoomifyU-web-application.

  ## Running the code

  Run `npm i` to install the dependencies.

### Database setup (MySQL)

- Create a database (example): `CREATE DATABASE roomifyu;`
- Copy `.env.example` to `.env` and fill in your MySQL credentials.

The API will auto-create the `bookings` table on startup.

### Run the app (web + API)

Run `npm run dev` to start:
- the Vite web app
- the local API server on `http://localhost:3001`
  