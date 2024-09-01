### Event management 


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

