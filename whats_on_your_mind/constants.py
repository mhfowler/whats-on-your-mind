import os

PROJECT_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
print '++ PROJECT_PATH: {}'.format(PROJECT_PATH)
FRIENDS_FOLDER = os.path.join(PROJECT_PATH, 'data/friends')
POSTS_FOLDER = os.path.join(PROJECT_PATH, 'data/posts')
SCREENSHOT_DIR = os.path.join(PROJECT_PATH, 'data/screenshots')

if not os.path.exists(FRIENDS_FOLDER):
    os.makedirs(FRIENDS_FOLDER)

if not os.path.exists(POSTS_FOLDER):
    os.makedirs(POSTS_FOLDER)

if not os.path.exists(SCREENSHOT_DIR):
    os.makedirs(SCREENSHOT_DIR)