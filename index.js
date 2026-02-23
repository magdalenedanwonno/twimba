import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

// Load saved tweets from localStorage
const savedTweets = JSON.parse(localStorage.getItem('tweetsData'))
const currentUser = '@Magdalene'  // Logged in user

let lastDeletedTweet = null
let lastDeletedIndex = null

// If there are saved tweets, use them
if (savedTweets) {
    tweetsData.length = 0
    tweetsData.push(...savedTweets)
}

// Event delegation for clicks
document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.dataset.replyBtn){
        handleReplyBtnClick(e.target.dataset.replyBtn)
    }
    else if(e.target.dataset.delete){
        handleDeleteClick(e.target.dataset.delete)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.id === 'undo-delete-btn'){
        undoDelete()
    }
})

// Like a tweet
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(tweet => tweet.uuid === tweetId)[0]
    targetTweetObj.likes += targetTweetObj.isLiked ? -1 : 1
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    saveToLocalStorage()
    render()
}

// Retweet a tweet
function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(tweet => tweet.uuid === tweetId)[0]
    targetTweetObj.retweets += targetTweetObj.isRetweeted ? -1 : 1
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    saveToLocalStorage()
    render() 
}

// Toggle replies section
function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

// Add a reply
function handleReplyBtnClick(tweetId){
    const replyInput = document.getElementById(`reply-input-${tweetId}`)
    if(!replyInput.value) return

    const targetTweetObj = tweetsData.filter(tweet => tweet.uuid === tweetId)[0]
    targetTweetObj.replies.push({
        handle: currentUser,
        profilePic: 'images/scrimbalogo.png',
        tweetText: replyInput.value
    })

    saveToLocalStorage()
    render()
}

// Save tweets to localStorage
function saveToLocalStorage(){
    localStorage.setItem('tweetsData', JSON.stringify(tweetsData))
}

// Delete a tweet (only current user's)
function handleDeleteClick(tweetId){
    const tweet = tweetsData.find(t => t.uuid === tweetId)
    if(tweet.handle !== currentUser) return

    const index = tweetsData.findIndex(t => t.uuid === tweetId)
    lastDeletedTweet = tweetsData[index]
    lastDeletedIndex = index

    tweetsData.splice(index, 1)
    saveToLocalStorage()
    render()
}

// Undo last delete
function undoDelete(){
    if(!lastDeletedTweet) return

    tweetsData.splice(lastDeletedIndex, 0, lastDeletedTweet)
    saveToLocalStorage()
    render()
    lastDeletedTweet = null
    lastDeletedIndex = null
}

// Post a new tweet
function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    if(!tweetInput.value) return

    tweetsData.unshift({
        handle: currentUser,
        profilePic: '/images/madleyprofile.webp',
        likes: 0,
        retweets: 0,
        tweetText: tweetInput.value,
        replies: [],
        isLiked: false,
        isRetweeted: false,
        uuid: uuidv4()
    })

    saveToLocalStorage()
    render()
    tweetInput.value = ''
}

// Generate the feed HTML
function getFeedHtml(){
    let feedHtml = ''

    tweetsData.forEach(tweet => {
        const likeIconClass = tweet.isLiked ? 'liked' : ''
        const retweetIconClass = tweet.isRetweeted ? 'retweeted' : ''

        let repliesHtml = ''
        if(tweet.replies.length > 0){
            tweet.replies.forEach(reply => {
                repliesHtml += `
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${reply.handle}</p>
            <p class="tweet-text">${reply.tweetText}</p>
        </div>
    </div>
</div>`
            })
        }

        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
                    ${tweet.handle === currentUser ? `<i class="fa-solid fa-trash" data-delete="${tweet.uuid}"></i>` : ''}
                </span>
            </div>
        </div>
    </div>

    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}

        <div class="reply-input-area">
            <textarea class="reply-input" id="reply-input-${tweet.uuid}" placeholder="Write a reply..."></textarea>
            <button class="reply-btn" data-reply-btn="${tweet.uuid}">Reply</button>
        </div>
    </div>
</div>`
    })

    return feedHtml
}

// Render feed to DOM
function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

// Initial render
render()