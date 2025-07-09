let leftnews = [];
let rightnews = [];
let bottomNews = [];
let topHeadline = [];

let leftindex = 0;
let rightindex = 0;

let nextRefresh = 30 * 60;
let isLive = true;

// Initialize the application
function init() {
    updateTime();
    updateCountdown();
    fetchNewsFromBackend();

    setInterval(updateTime, 1000);
    setInterval(updateCountdown, 1000);
    setInterval(updateleftnews, 5000);
    setInterval(updaterightnews, 8000);

    console.log('News Channel initialized');
}

async function fetchNewsFromBackend() {
    try {
        const [leftRes, rightRes, topRes, bottomRes] = await Promise.all([
            fetch("/api/news/left"),
            fetch("/api/news/right"),
            fetch("/api/news/top"),
            fetch("/api/news/bottom")
        ]);

        leftnews = await leftRes.json();
        rightnews = await rightRes.json();
        topHeadline = await topRes.json();
        bottomNews = await bottomRes.json();

        renderTopHeadline();
        renderBottomTicker();
        updateleftnews();
        updaterightnews();
        updateNewsTimestamps();
    } catch (err) {
        console.error("Error fetching news from backend:", err);
    }
}

function updateleftnews() {
    const leftdiv = document.getElementById("left");
    if (leftnews.length === 0) return;

    leftdiv.classList.add("fade-out");

    setTimeout(() => {
        leftindex = (leftindex + 1) % leftnews.length;
        const news = leftnews[leftindex];

        document.getElementById("leftcato").innerText = news.category.toUpperCase();
        document.getElementById("lefttitle").innerText = news.title;
        document.getElementById("leftcontent").innerText = news.description;
        document.getElementById("left-updated").innerText = new Date().toLocaleString();

        leftdiv.classList.remove("fade-out");
    }, 500);
}

function updaterightnews() {
    const rightdiv = document.getElementById("right");
    if (rightnews.length === 0) return;

    rightdiv.classList.add("fade-out");

    setTimeout(() => {
        rightindex = (rightindex + 1) % rightnews.length;
        const news = rightnews[rightindex];

        document.getElementById("rightcato").innerText = news.category.toUpperCase();
        document.getElementById("righttitle").innerText = news.title;
        document.getElementById("rightcontent").innerText = news.description;
        document.getElementById("right-updated").innerText = new Date().toLocaleString();

        rightdiv.classList.remove("fade-out");
    }, 500);
}

function updateTime() {
    document.getElementById('current-time').textContent = new Date().toLocaleTimeString();
}

function updateCountdown() {
    if (nextRefresh <= 1) {
        refreshNews();
        nextRefresh = 30 * 60;
    } else {
        nextRefresh--;
    }

    const minutes = Math.floor(nextRefresh / 60);
    const seconds = nextRefresh % 60;
    document.getElementById('countdown').textContent =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function refreshNews() {
    fetchNewsFromBackend();

    const liveStatus = document.getElementById('live-status');
    liveStatus.style.color = '#fbbf24';
    liveStatus.textContent = 'UPDATING';

    setTimeout(() => {
        liveStatus.style.color = '#10b981';
        liveStatus.textContent = 'LIVE';
    }, 2000);
}

function updateNewsTimestamps() {
    const now = new Date().toLocaleString();
    document.getElementById('left-updated').textContent = now;
    document.getElementById('right-updated').textContent = now;
}

function renderTopHeadline() {
    const topEl = document.querySelector('.top-headlines .marquee-content');
    if (topEl && topHeadline.length > 0) {
        topEl.innerHTML = topHeadline.map(news=> `<span>${news.title} • </span>`).join('');
    }
}

function renderBottomTicker() {
    const bottomEl = document.querySelector('.bottom-headlines .marquee-content-reverse');
    if (bottomEl && bottomNews.length > 0) {
        bottomEl.innerHTML = bottomNews.map(news => `<span>${news.title} • </span>`).join('');
    }
}

function toggleLiveStatus() {
    isLive = !isLive;
    const liveStatus = document.getElementById('live-status');
    const liveDot = document.querySelector('.live-dot');

    if (isLive) {
        liveStatus.textContent = 'LIVE';
        liveStatus.style.color = '#10b981';
        liveDot.style.backgroundColor = '#10b981';
    } else {
        liveStatus.textContent = 'OFFLINE';
        liveStatus.style.color = '#ef4444';
        liveDot.style.backgroundColor = '#ef4444';
    }
}

document.addEventListener('DOMContentLoaded', init);

window.newsChannel = {
    refreshNews,
    toggleLiveStatus,
    updateNewsTimestamps
};


// // Global variables
// let nextRefresh = 30 * 60; // 30 minutes in seconds
// let isLive = true;

// //  lists which contains the dynammic data
// let leftnews=[
//    {
//     title: "Global Climate Summit Breakthrough",
//     content: "World leaders have reached a groundbreaking agreement on carbon emission targets...",
//     category: "Environment"
//   },
//   {
//     title: "Green Energy Investment Surges",
//     content: "Investments in solar and wind power have increased by 35% over the past year...",
//     category: "Environment"
//   },
//   {
//     title: "AI Diagnoses Diseases Faster Than Doctors",
//     content: "A new AI system has outperformed medical professionals in early diagnosis of certain conditions.",
//     category: "Technology"
//   },
  
// ]
// let rightnews=[
//     {
//     title: "Mars Mission Achieves Orbit",
//     content: "The latest interplanetary probe has successfully entered Mars' orbit, beginning a two-year research mission.",
//     category: "Space"
//   },
//   {
//     title: "Global Markets Show Signs of Recovery",
//     content: "After a turbulent year, international stock markets are seeing optimistic signs of economic rebound.",
//     category: "Economy"
//   },
//   {
//     title: "Breakthrough in Cancer Treatment",
//     content: "Researchers have developed a targeted therapy that shows promise in shrinking tumors with fewer side effects.",
//     category: "Health"
//   },
//   {
//     title: "New Cybersecurity Framework Announced",
//     content: "Government and tech companies collaborate to launch a new standard for securing online infrastructure.",
//     category: "Technology"
//   }
// ]
// let leftindex=0;
// let rightindex=0;
// // Initialize the application
// function init() {
//     updateTime();
//     updateCountdown();
//     updateNewsTimestamps();
    
//     // Update time every second
//     setInterval(updateTime, 1000);
    
//     // Update countdown every second
//     setInterval(updateCountdown, 1000);
//     // upadate the left news for every 5 secs
//     setInterval(updateleftnews, 5000);
//     // upadate the lright news for every 8 secs
//     setInterval(updaterightnews, 8000);
    
//     console.log('News Channel initialized');
// }

// // updating the left and right news!!

// const updateleftnews=()=>{
//     const leftdiv=document.getElementById("left");
    
//     leftdiv.classList.add("fade-out")
//     setTimeout(()=>{
//         leftindex=(leftindex+1)%leftnews.length;
//         document.getElementById("leftcato").innerText=(leftnews[leftindex].category).toUpperCase();
//         document.getElementById("lefttitle").innerText=leftnews[leftindex].title;
//         document.getElementById("leftcontent").innerText=leftnews[leftindex].content;
//         document.getElementById("left-updated").innerText=new Date().toLocaleString();
        
        
        
//         leftdiv.classList.remove("fade-out")
//     },500)
    
// }
// const updaterightnews=()=>{
//     const rightdiv=document.getElementById("right");
//     rightdiv.classList.add("fade-out")
//     setTimeout(()=>{
//         rightindex=(rightindex+1)%rightnews.length;
        
//         document.getElementById("rightcato").innerText=(rightnews[rightindex].category).toUpperCase();
//          document.getElementById("righttitle").innerText=rightnews[rightindex].title;
//         document.getElementById("rightcontent").innerText=rightnews[rightindex].content;
//         document.getElementById("right-updated").innerText=new Date().toLocaleString();

//         rightdiv.classList.remove("fade-out")
//     },500)

// }

// // Update current time display
// function updateTime() {
//     const now = new Date();
//     const timeString = now.toLocaleTimeString();
//     document.getElementById('current-time').textContent = timeString;
// }

// // Update countdown timer
// function updateCountdown() {
//     if (nextRefresh <= 1) {
//         // Simulate news refresh
//         console.log('Refreshing news content...');
//         refreshNews();
//         nextRefresh = 30 * 60; // Reset to 30 minutes
//     } else {
//         nextRefresh--;
//     }
    
//     const minutes = Math.floor(nextRefresh / 60);
//     const seconds = nextRefresh % 60;
//     const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
//     document.getElementById('countdown').textContent = formattedTime;
// }

// // Update news timestamps
// function updateNewsTimestamps() {
//     const now = new Date();
//     const timestamp = now.toLocaleString();
    
//     document.getElementById('left-updated').textContent = timestamp;
//     document.getElementById('right-updated').textContent = timestamp;
// }

// // Simulate news refresh (placeholder for future API integration)
// function refreshNews() {
//     console.log('News refresh triggered - ready for API integration');
//     updateNewsTimestamps();
    
//     // Flash the live indicator to show refresh
//     const liveStatus = document.getElementById('live-status');
//     liveStatus.style.color = '#fbbf24';
//     liveStatus.textContent = 'UPDATING';
    
//     setTimeout(() => {
//         liveStatus.style.color = '#10b981';
//         liveStatus.textContent = 'LIVE';
//     }, 2000);
// }

// // Toggle live status (for testing)
// function toggleLiveStatus() {
//     isLive = !isLive;
//     const liveStatus = document.getElementById('live-status');
//     const liveDot = document.querySelector('.live-dot');
    
//     if (isLive) {
//         liveStatus.textContent = 'LIVE';
//         liveStatus.style.color = '#10b981';
//         liveDot.style.backgroundColor = '#10b981';
//     } else {
//         liveStatus.textContent = 'OFFLINE';
//         liveStatus.style.color = '#ef4444';
//         liveDot.style.backgroundColor = '#ef4444';
//     }
// }

// // Initialize when DOM is loaded
// document.addEventListener('DOMContentLoaded', init);

// // Export functions for potential external use
// window.newsChannel = {
//     refreshNews,
//     toggleLiveStatus,
//     updateNewsTimestamps
// };

















// let leftnews = [];
// let rightnews = [];
// let bottomNews = [];
// let topHeadline = "";

// let leftindex = 0;
// let rightindex = 0;

// let nextRefresh = 30 * 60;
// let isLive = true;

// // Initialize everything
// function init() {
//     updateTime();
//     updateCountdown();
//     fetchNewsFromBackend();

//     setInterval(updateTime, 1000);
//     setInterval(updateCountdown, 1000);
//     setInterval(updateleftnews, 5000);
//     setInterval(updaterightnews, 8000);
// }

// // Fetch all dynamic data
// async function fetchNewsFromBackend() {
//     try {
//         const [leftRes, rightRes, topRes, bottomRes] = await Promise.all([
//             fetch("/api/news/left"),
//             fetch("/api/news/right"),
//             fetch("/api/news/top"),
//             fetch("/api/news/bottom")
//         ]);

//         leftnews = await leftRes.json();
//         rightnews = await rightRes.json();
//         topHeadline = await topRes.text(); // top headline is a plain string
//         bottomNews = await bottomRes.json();

//         updateNewsTimestamps();
//         renderTopHeadline();
//         renderBottomTicker();
//         updateleftnews();
//         updaterightnews();
//     } catch (err) {
//         console.error("Error fetching news:", err);
//     }
// }

// // Updates for Left News
// const updateleftnews = () => {
//     const leftdiv = document.getElementById("left");
//     if (leftnews.length === 0) return;

//     leftdiv.classList.add("fade-out");

//     setTimeout(() => {
//         leftindex = (leftindex + 1) % leftnews.length;
//         const news = leftnews[leftindex];

//         document.getElementById("leftcato").innerText = news.category.toUpperCase();
//         document.getElementById("lefttitle").innerText = news.title;
//         document.getElementById("leftcontent").innerText = news.content;
//         document.getElementById("left-updated").innerText = new Date().toLocaleString();

//         leftdiv.classList.remove("fade-out");
//     }, 500);
// };

// // Updates for Right News
// const updaterightnews = () => {
//     const rightdiv = document.getElementById("right");
//     if (rightnews.length === 0) return;

//     rightdiv.classList.add("fade-out");

//     setTimeout(() => {
//         rightindex = (rightindex + 1) % rightnews.length;
//         const news = rightnews[rightindex];

//         document.getElementById("rightcato").innerText = news.category.toUpperCase();
//         document.getElementById("righttitle").innerText = news.title;
//         document.getElementById("rightcontent").innerText = news.content;
//         document.getElementById("right-updated").innerText = new Date().toLocaleString();

//         rightdiv.classList.remove("fade-out");
//     }, 500);
// };

// function updateTime() {
//     document.getElementById('current-time').textContent = new Date().toLocaleTimeString();
// }

// function updateCountdown() {
//     if (nextRefresh <= 1) {
//         refreshNews();
//         nextRefresh = 30 * 60;
//     } else {
//         nextRefresh--;
//     }

//     const minutes = Math.floor(nextRefresh / 60);
//     const seconds = nextRefresh % 60;
//     document.getElementById('countdown').textContent =
//         `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
// }

// function refreshNews() {
//     fetchNewsFromBackend();

//     const liveStatus = document.getElementById('live-status');
//     liveStatus.style.color = '#fbbf24';
//     liveStatus.textContent = 'UPDATING';

//     setTimeout(() => {
//         liveStatus.style.color = '#10b981';
//         liveStatus.textContent = 'LIVE';
//     }, 2000);
// }

// function updateNewsTimestamps() {
//     const now = new Date().toLocaleString();
//     document.getElementById('left-updated').textContent = now;
//     document.getElementById('right-updated').textContent = now;
// }

// function renderTopHeadline() {
//     const topEl = document.querySelector('.top-headlines .marquee-content');
//     if (topEl) {
//         topEl.innerHTML = `<span>${topHeadline} • </span>`;
//     }
// }

// function renderBottomTicker() {
//     const bottomEl = document.querySelector('.bottom-headlines .marquee-content-reverse');
//     if (bottomEl && Array.isArray(bottomNews)) {
//         bottomEl.innerHTML = bottomNews.map(news => `<span>${news.title} • </span>`).join('');
//     }
// }

// document.addEventListener('DOMContentLoaded', init);
