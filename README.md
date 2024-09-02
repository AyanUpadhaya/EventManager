## Event management Backend

Event management backend app created with express js and mysql2

### Installation part
``` bash
git clone https://github.com/AyanUpadhaya/EventManager.git
```

<b>Extract and Run npm installation</b>

```bash
npm install
```

### Use local or Online MYSQL Database

Add your own credentials in the .env file

``` .env
PORT=
MYSQL_PORT=
MYSQL_HOST=
MYSQL_PASSWORD=
MYSQL_USER=
MYSQL_DATABASE=
SECRET_KEY=
```

### Create necessary table as below

``` sql
-- Users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Store hashed passwords
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT NOT NULL
);
-- Participants table 

CREATE TABLE participants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL 
);
-- Event_Participants table
CREATE TABLE event_participants (
  event_id INT NOT NULL,
  participant_id INT NOT NULL,
  PRIMARY KEY (event_id, participant_id),
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (participant_id) REFERENCES participants(id)
);

```

We are using users table for authentication purpose to user jwt token. the participants table stores information about individual participants, while the event_participants table establishes a many-to-many relationship between events and participants. This allows us to manage the relationships between events and participants in a flexible and scalable way.

#### Start Server

``` bash
npm run dev
```

### User create

``` js
router.post("/users", createUser);
```

Example Data
``` js
{
    "name":"Kabir Khan",
    "email":"kabirkhan@gmail.com",
    "password":"123456"
}
```

### User login
``` js
router.post("/users/login", signIn);
```

Obtain Auth token

``` js
{
    "status": 200,
    "message": "User logged in ",
    "data": {
        "id": 1,
        "email": "***************",
        "name": "********",
        "token": "**********"
    }
}

```


#### GET Events

Authorization token required

``` js
router.get("/events", verifyToken, getEvents)
```

Pagination Example
```js
/events?page=1&size=10
```

#### Post Event

router.post("/events", createEvent);

Example data

``` js

{
  "name": "Summer Festival",
  "date": "2023-07-15",
  "start_time": "10:00:00",
  "end_time": "18:00:00",
  "location": "Central Park",
  "description": "Join us for a fun-filled day of music, food, and games at the Summer Festival!"
}

```

Get Event by id

``` js
router.get("/events/:id", verifyToken, getSingleEvent);
```

### All Endpoints

``` js

baseurl: http://localhost/:3000

// User Routes
// ===========================
router.get("/users", verifyToken, getUsers);
router.post("/users", createUser);
router.post("/users/login", signIn);

// Participant Routes
// =============================
router.post("/participants", verifyToken, createParticipant);
router.get("/participants", verifyToken, getParticipants);
router.get("/participants/:id", verifyToken, getParticipantById);
router.put("/participants/:id", verifyToken, updateParticipant);
router.delete("/participants/:id", verifyToken, deleteParticipant);

// Event Routes
// ===============================
router.post("/events", createEvent);
router.get("/events", verifyToken, getEvents);
router.get("/events/:id", verifyToken, getSingleEvent);
router.delete("/events/:id", verifyToken, deleteEvent);
router.put("/events/:id", verifyToken, updateEvent);
router.post(
  "/events/:id/participants", 
  verifyToken, 
  addEventParticipant
);
router.delete(
  "/events/:id/participants/:participantId",
  verifyToken,
  removeEventParticipant
);

// Optional Event Participant Routes
=====================================
router.post(
  "/event_participants",
  verifyToken,
  createEventParticipant
);
router.get(
  "/event_participants/:event_id/participants/:participant_id",
  verifyToken,
  getEventParticipant
);
router.get(
  "/event_participants/:event_id",
  verifyToken,
  getEventParticipants
);

```