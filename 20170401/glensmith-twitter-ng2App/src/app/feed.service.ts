import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Tweet } from './tweet';
import { Http, Response  }    from '@angular/http';
import { Observable } from 'rxjs';


@Injectable()
export class FeedService {

tweets = []


private getTweetFromJson(obj: Tweet) : Tweet {
  return new Tweet( obj.id, obj.body,obj.author,obj.date,obj.retweets,obj.favorites);
}



constructor(private userService: UserService, private http : Http) { }

  getCurrentFeed() : Observable<Tweet[]> {
    return this.http.get('http://localhost:8080/glensmith-twitter-service/rest/tweets').map((resp: Response) => {
      var fetchedTweets = [];
      for (let tweet of resp.json()) {
        fetchedTweets.push(this.getTweetFromJson(tweet));
      }
      return fetchedTweets as Array<Tweet>;
    });

  }

  private isUserInCollection(collection : string[], userId : string) : boolean {
      return collection.indexOf(userId) != -1;
  }

  postNewTweet(tweetText : string) {
    // this.tweets.unshift(
    //       new Tweet(tweetText, this.userService.getCurrentUser(), new Date(), [], []) 
    //    );
  }

  reTweet(tweet : Tweet) {
    if (!this.isUserInCollection(tweet.retweets, this.userService.getCurrentUser())) {
      tweet.retweets.push(this.userService.getCurrentUser());
    }
  }

  favoriteTweet(tweet : Tweet) {
    if (!this.isUserInCollection(tweet.favorites, this.userService.getCurrentUser())) {
      tweet.favorites.push(this.userService.getCurrentUser());
    }
  }

  getFriends() : Observable<string[]> {
    return this.http.get('/assets/friends.json').map((resp: Response) => resp.json() as string[]);
  }
}
