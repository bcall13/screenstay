"use strict";
/* =========================================================
   CONFIG — edit content here without touching layout code
   ========================================================= */
const CONFIG = Object.freeze({
  price: "[MONTHLY PRICE] / month or [YEARLY PRICE] / year",
  cities: ["[CITY 1]", "[CITY 2]", "[CITY 3]"],
  steps: [
    { chip: "01 Pick",    title: "Pick a Screenstay partner hotel",  text: "Search the directory and book the room that comes with a monitor on the desk.", art: "step1" },
    { chip: "02 Plug in", title: "Plug in your own laptop",          text: "One USB-C cable. Your machine, your files, your logins, nothing new to sign into.", art: "step2" },
    { chip: "03 Work",    title: "Get the home-office setup, on the road", text: "A real screen in the hotel room, so you work like you’re at your own desk. Every night of the trip.", art: "step3" }
  ],
  compare: {
    before: ["A 13-inch screen with windows stacked on windows.", "Trying to cast to a hotel TV that never connects.", "Hunched over the desk by 10 pm, getting half as much done."],
    after:  ["A full-size monitor already on the desk.", "One USB-C cable for display and power. Nothing to pair.", "The same setup in every partner hotel, every night of the trip."]
  },
  forms: {
    traveler: {
      submit: "Join the waitlist",
      done: "We’ll email you when Screenstay rooms open in your city.",
      fields: [
        { name: "name",  label: "Full name",  type: "text",  rule: "name",  autocomplete: "name" },
        { name: "email", label: "Work email", type: "email", rule: "email", autocomplete: "email" },
        { name: "city",  label: "Home city",  type: "text",  rule: "place", autocomplete: "address-level2" },
        { name: "freq",  label: "How often do you travel for work?", type: "select", options: ["A few times a year", "About once a month", "Most weeks"] }
      ]
    },
    hotel: {
      submit: "Request partner info",
      done: "We’ll reach out about bringing Screenstay rooms to your property.",
      fields: [
        { name: "name",     label: "Your name",      type: "text",  rule: "name",  autocomplete: "name" },
        { name: "email",    label: "Work email",     type: "email", rule: "email", autocomplete: "email" },
        { name: "property", label: "Hotel or group", type: "text",  rule: "place", autocomplete: "organization" },
        { name: "city",     label: "City",           type: "text",  rule: "place", autocomplete: "address-level2" },
        { name: "rooms",    label: "Rooms you’d consider", type: "select", options: ["1–5 to pilot", "6–20", "More than 20"] }
      ]
    }
  },
  /* No backend yet. When one exists, put its URL here and see Submit below. */
  submitEndpoint: null
});

