# 🌸 PadPal — Anonymous Peer Support Web App

> A safe, anonymous platform for hostel girls to request and share period supplies with each other — no names, no embarrassment.

---

## 🔗 Link

* 💻 **GitHub:** [github.com/yourusername/padpal](https://github.com/yourusername/padpal)

**Tech Stack:** React.js, React Router, Context API, Node.js, Express.js, MongoDB, Mongoose, Socket.io, JWT, bcryptjs

---

## 📌 Problem Statement

Every girl living in a hostel has faced this moment — it's midnight, periods arrive unexpectedly, and she's out of pads. No painkillers. In pain and uncomfortable.

**The options available are bad:**

* 🚶 Walk to a medical store alone at night — unsafe
* 📱 Ask on the hostel WhatsApp group — embarrassing in front of 200 people
* 🚪 Knock on a stranger's door — awkward and uncomfortable
* 😔 Suffer silently — unfortunately the most common choice

**The core problem is not availability — it's embarrassment.**

Girls in the same hostel building often have exactly what another girl needs, just a few rooms away. But there is no safe, private, dignified way to ask.

---

## ✅ Solution

PadPal is an **anonymous peer-to-peer support web app** built exclusively for hostel girls.

* Post a request anonymously
* Nearby girls see it instantly via a real-time feed
* Someone offers to help
* Item gets delivered discreetly
* No names. No embarrassment. No judgment.

---

## 🚀 Features

### 🔐 Anonymous Authentication

* Register with nickname, avatar, hostel block and room number
* No real name required
* JWT tokens with 7-day expiry
* Auto logout on token expiry via Axios interceptor
* bcrypt password hashing with salt round 12

### 📋 Real-time Request Feed

* See all open requests from your hostel block
* Socket.io rooms scoped per hostel block
* Feed updates instantly when someone posts
* Emergency requests shown first

### 🆘 Raise a Request

* 5 request categories — Pad Normal, Pad XL, Painkiller, Heating Pad, Other
* 2 urgency levels — Normal and Emergency
* Duplicate request prevention
* Location automatically filled from profile

### 🤝 Help Someone

* Tap **I Can Help** on any request
* Choose estimated delivery time
* Get delivery instructions
* Mark as dropped after delivering

### ✅ My Requests

* Track all your own requests
* Status tracking — Open → Matched → Completed
* Rate the helper with stars after receiving
* Mark as received

### 🏆 Gamification

* Helpers earn 10 points for normal delivery
* Helpers earn 15 points for emergency delivery
* 3 automatically assigned badge tiers:

  * 🩸 **Period Pal** — 10 points
  * ⚡ **Fast Responder** — 30 points
  * 🏆 **Care Champion** — 60 points

### 🛡️ Admin Panel

* 4 live statistics — total requests, completed, open, total users
* Full user list with compassion points
* Block and unblock users
* Abuse prevention controls

### 🔒 Security

* Rate limiting — 100 requests per 15 minutes globally
* Stricter authentication rate limit — 10 attempts per 15 minutes
* express-validator input validation on routes
* Helmet for HTTP security headers
* Request body size limited to 10 KB
