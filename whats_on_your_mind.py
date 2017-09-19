from osf.scrapers.facebook import FbScraper
from osf_scraper_api.settings import ENV_DICT
import os
import datetime


PROJECT_PATH = os.path.abspath(os.path.dirname(__file__))
print '++ PROJECT_PATH: {}'.format(PROJECT_PATH)
FRIENDS_FOLDER = os.path.join(PROJECT_PATH, 'data/friends')
POSTS_FOLDER = os.path.join(PROJECT_PATH, 'data/posts')

if not os.path.exists(FRIENDS_FOLDER):
    os.makedirs(FRIENDS_FOLDER)

if not os.path.exists(POSTS_FOLDER):
    os.makedirs(POSTS_FOLDER)


def scrape_posts(user):
    fbscraper = FbScraper(
        fb_username=ENV_DICT['FB_USERNAME'],
        fb_password=ENV_DICT['FB_PASSWORD'],
        command_executor=None)
    import json
    friends_file = os.path.join(FRIENDS_FOLDER, '{}.json'.format(user))
    with open(friends_file, 'r') as f:
        friends_dict = json.loads(f.read())
    friends = friends_dict[user]
    for friend in friends:
        print '++ scraping posts for {}'.format(friend)
        posts_path = os.path.join(POSTS_FOLDER, '{}.json'.format(friend))
        if not os.path.exists(posts_path):
            output = fbscraper.get_posts({
                'users': [friend],
                # 'before_date': datetime.date(year=2017, month=8, day=30),
                # 'after_date': datetime.date(year=2017, month=8, day=1),
                'jump_to': datetime.date(year=2016, month=11, day=30),
                'before_date': datetime.date(year=2016, month=11, day=20),
                'after_date': datetime.date(year=2016, month=11, day=7),
            })
            with open(posts_path, 'w') as f:
                f.write(json.dumps(output))
        else:
            print '++ posts.json already exists for {}'.format(user)


def scrape_friends(user):
    print '++ scraping'
    fbscraper = FbScraper(
        fb_username=ENV_DICT['FB_USERNAME'],
        fb_password=ENV_DICT['FB_PASSWORD'],
        command_executor=None)
    import json
    output = fbscraper.get_friends([user])
    print json.dumps(output)


if __name__ == '__main__':
  scrape_posts('maxhfowler')
