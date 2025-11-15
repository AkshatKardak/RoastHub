## 🚀RoastHub - Savage Tweet Generator

Generate brutal, no-filter tweets with authentic Indian flavor! RoastHub creates savage tweets infused with Bollywood references, cricket banter, and viral desi slang that makes everyone go "so true!" 💀

## 🚀 Live Deployment

[![Frontend](https://img.shields.io/badge/Frontend-Live-success?style=for-the-badge&logo=render)](https://roasthubfront.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Live-success?style=for-the-badge&logo=render)](https://roasthub-backend-api.onrender.com)

- **Frontend**: [https://roasthubfront.vercel.app](https://roasthubfront.vercel.app)
- **Backend API**: [https://roasthub-backend-api.onrender.com](https://roasthub-backend-api.onrender.com)

---

## Features
- **AI-Powered Savage Tweets** - Generate 10 brutal tweets on any trending topic

- **Authentic Desi Flavor** - Bollywood references, Cricket analogies, and Indian slang

- **Viral Rating System** - Get ratings for viral potential, relatability, savage level, and brutal factor

- **Gaming-Inspired UI** - Cool gradient animations with vibrant colors

- **Real-time Generation** - Instant tweet generation with AI

- **Responsive Design** - Works perfectly on all devices

---

## 🛠️Tech Stack

**Frontend**
- React 
- Vite 
- Framer Motion
- Axios 

---

**Backend**
- Node.js & Express
- MongoDB & Mongoose
- GROQ API

---

## Installation
Clone the repository

```sh
git clone https://github.com/AkshatKardak/RoastHub.git
cd RoastHub-app
```

- Install dependencies for both frontend and backend
```sh
npm run install-all
```
---

**Environment Setup**
- Backend (.env)
- env
- MONGODB_URI=your local host
- PORT=5000
- GROQ_KEY=your_groq_api_key_here

---

**Run the application**
```sh
npm run dev
```
This starts both:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

---

## 📁 Project Structure
```plaintext
RoastHub-app/
├── backend/
│   ├── controllers/
│   │   └── tweetController.js    # AI tweet generation logic
│   ├── models/
│   │   └── Tweet.js              # MongoDB schema
│   ├── routes/
│   │   └── tweets.js             # API routes
│   ├── server.js                 # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Main React component
│   │   ├── App.css               # Styling with animations
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── package.json                  # Root package for running both
```

---

## How to Use
- Enter a Trending Topic
- Type any topic like "IPL", "Bollywood nepotism", "Indian politics"
- Generate Tweets
- Click "Generate Savage Tweets" button
- Watch AI create 10 brutal tweets instantly
- Analyze Results

***Each tweet comes with four ratings:***

- 🔥 Viral Potential - Likelihood to go viral

- 💖 Relatability - Indian audience connection

- ⚡ Savage Level - Brutal honesty meter

- 💀 Brutal Factor - Hard-hitting truth scale

---

## 🎯 API Endpoints
```sh
POST /api/tweets/generate
Generate savage tweets for a topic
json
{
  "topic": "IPL 2024"
}
GET /api/tweets/history
Get previously generated tweets

GET /api/health
Server health check
```
---

## 🎨 UI Features
- Gaming Gradient Background
- Rating Icons
- Smooth Animations
- Responsive Grid 
- Glass Morphism 

---

## 🔧 Development
```sh
npm run dev 
```
---

## 🤝 Contributing
- Fork the repository
- Create your feature branch (git checkout -b feature/AmazingFeature)
- Commit your changes (git commit -m 'Add some AmazingFeature')
- Push to the branch (git push origin feature/AmazingFeature)
- Open a Pull Request

---

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments
- GROQ for GPT API
- Indian Twitter for inspiration
- Bollywood and cricket for endless roasting material
- Desi Gen-Z for the savage slang
- Inspired from outskill 2 Day AI MasterMind Workshop 

Link of OutSkill website [OutSkill](https://www.outskill.com) Webpage

---

## Contributors
Akshat Kardak - GitHub Profile **"https://github.com/AkshatKardak"**
Made with ❤️ and lots of savage energy for the Indian internet!


#


