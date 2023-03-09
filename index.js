import { tweetsData } from './data.js'
import { userData } from './data.js'

import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const tweetOptionsModal = document.getElementById('tweet-options-modal')

document.addEventListener('click', function(e){
    if (e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if (e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if (e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if (e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if (e.target.dataset.deleteTweet) {
        handleDeleteTweetClick(e.target.dataset.deleteTweet)
    }
    else if (e.target.dataset.replyTweet) {
        handleReplyTweetBtnClick(e.target.dataset.replyTweet)
    }
    else if (e.target.dataset.tweetOptions) {
        openModal(e)
    }
    else if(!e.target.closest('#tweet-options-modal')) {
        closeModal()
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: userData.handle,
            profilePic: userData.profilePic,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })

        render()
        tweetInput.value = ''
    }

}

function handleDeleteTweetClick(deleteTweetId) {
    const deleteTweetIndex = tweetsData.map(function(tweet) {
        return tweet.uuid
    }).indexOf(deleteTweetId);
    
    tweetsData.splice(deleteTweetIndex, 1)

    closeModal()

    render()
}

function handleReplyTweetBtnClick(replyTweetId) {
    const tweetReplyTextArea = document.getElementById(`tweet-reply-${replyTweetId}`)

    if (tweetReplyTextArea.value) {
        const tweetObj = tweetsData.filter(function(tweet) {
            return tweet.uuid === replyTweetId
        })[0]
    
        tweetObj.replies.unshift({
            handle: userData.handle,
            profilePic: userData.profilePic,
            tweetText: tweetReplyTextArea.value,
        })
    
        tweetReplyTextArea.value = ''
    
        render()

        document.getElementById(`replies-${replyTweetId}`).classList.toggle('hidden')
    }
}

function openModal(e) {
    tweetOptionsModal.style.display = 'block'
    tweetOptionsModal.style.left = e.target.offsetLeft
    tweetOptionsModal.style.top = e.target.offsetTop

    document.getElementById('tweet-options-delete').setAttribute('data-delete-tweet', e.target.dataset.tweetOptions)
}

function closeModal(){
    tweetOptionsModal.style.display = 'none'
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if (tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${reply.handle}</p>
                                    <p class="tweet-text">${reply.tweetText}</p>
                                </div>
                            </div>
                    </div>
                `
            })
        }
        
          
        feedHtml += `
            <div class="tweet">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <div class="tweet-header ">
                            <p class="handle">${tweet.handle}</p>
                            <i class="tweet-options fa-solid fa-ellipsis" 
                            data-tweet-options="${tweet.uuid}"></i>
                        </div>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-regular fa-comment-dots"
                                data-reply="${tweet.uuid}"
                                ></i>
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${likeIconClass}"
                                data-like="${tweet.uuid}"
                                ></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetIconClass}"
                                data-retweet="${tweet.uuid}"
                                ></i>
                                ${tweet.retweets}
                            </span>
                        </div>   
                    </div>            
                </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${userData.profilePic}" class="profile-pic">
                                <div>
                                    <textarea class="reply-textarea" placeholder="Tweet your reply" id="tweet-reply-${tweet.uuid}"></textarea>
                                    <div class="text-align-right">
                                    <button class="reply-btn" data-reply-tweet="${tweet.uuid}">Reply</button>
                                    </div>
                                </div>
                            </div>
                    </div>
                    ${repliesHtml}
                </div>   
            </div>
        `
   })

   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

