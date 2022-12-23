import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

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
  else if (e.target.dataset.delete){
    handleDeleteClick(e.target.dataset.delete)
  }
  else if (e.target.id === 'tweet-btn'){
    handleTweetBtnClick()
  }
  else if (e.target.id === 'reply-btn'){
    handleReplyBtnClick(e.target.dataset.replyTweet)
  }

})

function handleLikeClick(tweetId){ 
  const targetTweetObj = tweetsData.filter(function(tweet){
    return tweet.uuid === tweetId
  })[0]

  if (targetTweetObj.isLiked){
    targetTweetObj.likes--
  }
  else {
    targetTweetObj.likes++
  }

  targetTweetObj.isLiked = !targetTweetObj.isLiked
  render()
}

function handleRetweetClick(tweetId){
  const targetTweetObj = tweetsData.filter(function(tweet){
    return tweet.uuid === tweetId
  })[0]

  if (targetTweetObj.isRetweeted){
    targetTweetObj.retweets--
  }
  else {
    targetTweetObj.retweets++
  }

  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
  render()
}

function handleDeleteClick(tweetId){

  const objWithDataIndex = tweetsData.findIndex(function(obj){
    return obj.uuid === tweetId
  })

  console.log(objWithDataIndex)

  tweetsData.splice(objWithDataIndex, 1)

  /* tweetsData.filter(function(tweet){
    return tweet.uuid != tweetId
  }) */

  render()
}

function handleReplyClick(replyId){
  document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
  const tweetInput = document.getElementById('tweet-input')

  if (tweetInput.value){

    tweetsData.unshift({
      handle: `Twimba`,
      profilePic: `images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      canDelete: true,
      uuid: uuidv4()
    })
    
    render()

    tweetInput.value = ''

  }
}

function handleReplyBtnClick(tweetId){
  let replyMessage = document.getElementById(`reply-input-${tweetId}`)

  tweetsData.forEach(function(tweet){
    if (tweet.uuid === tweetId){

      const newReplyObj = {
        handle: `Twimba`,
        profilePic: `images/scrimbalogo.png`,
        tweetText: replyMessage.value,
      }

      tweet.replies.unshift(newReplyObj)

      replyMessage.value = ''

      render()
    }
  })


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

    let deleteIconHtml = ''

    if (tweet.canDelete){
      deleteIconHtml = `
      <span class="tweet-detail">
        <i class="fa-solid fa-trash" data-delete="${tweet.uuid}"></i>
      </span>
      `
    }

    let repliesHtml = `
    <div class="reply-container">
      <div class="reply-inner">
        <img src="images/scrimbalogo.png" class="profile-pic-reply">
        <textarea 
				placeholder="Tweet your reply" 
				id="reply-input-${tweet.uuid}"
        class="reply-input"
			  ></textarea>
        <button id="reply-btn" data-reply-tweet="${tweet.uuid}">Reply</button>
      </div>
    </div>
    `

    if (tweet.replies.length > 0){

      tweet.replies.forEach(function(reply){
        repliesHtml += `
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
            ${deleteIconHtml}            
          </div>   
        </div>            
      </div>
      <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
      </div>
    </div>`
  })

  return feedHtml
}

function render(){
  document.getElementById('feed').innerHTML = getFeedHtml()
}

render()