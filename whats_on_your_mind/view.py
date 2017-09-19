import os
import json
import datetime
import time
import random
import hashlib
import math

from PIL import Image
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

from osf_scraper_api.settings import ENV_DICT
from osf.scrapers.facebook import FbScraper

from whats_on_your_mind.constants import POSTS_FOLDER, SCREENSHOT_DIR


def fullpage_screenshot(driver, file):
    dpr = 2

    total_width = driver.execute_script("return document.body.offsetWidth")
    total_height = driver.execute_script("return document.body.parentNode.scrollHeight")
    viewport_height = driver.execute_script("return window.innerHeight")

    zone_height = viewport_height - 200
    num_rectangles = total_height / float(zone_height)
    num_loops = int(math.ceil(num_rectangles))
    stitched_image = Image.new('RGB', (total_width*dpr, total_height*dpr))
    for index in range(0, num_loops):
        scrolled_height = index*zone_height
        driver.execute_script("window.scrollTo({0}, {1})".format(0, scrolled_height))
        time.sleep(0.2)
        scroll_y = driver.execute_script("return window.scrollY")
        file_name = "part_{0}.png".format(index)
        driver.get_screenshot_as_file(file_name)
        screenshot = Image.open(file_name)
        # if scrolled down the page, then crop out the blue bar
        offset_h = 0
        if index > 0:
            offset_h = 44*dpr
            screenshot = screenshot.crop((0, offset_h, screenshot.width*dpr, screenshot.height*dpr))
        stitched_image.paste(screenshot, (0, offset_h + (scroll_y)*dpr))
        del screenshot
        os.remove(file_name)

    stitched_image.save(file)
    return True


def crop_and_save(input_path, location, size, output_path):

    padding = 15
    im = Image.open(input_path) # uses PIL library to open image in memory

    left = location['x'] - padding
    top = location['y'] - padding
    right = location['x'] + size['width'] + 2*padding
    bottom = location['y'] + size['height'] + 2*padding
    # bottom = im.height

    im = im.crop((left, top, right, bottom)) # defines crop points
    im.save(output_path)

def save_post(post, fbscraper):
    link = post['link']
    fbscraper.driver.get(link)
    time.sleep(2)
    x_elements = fbscraper.driver.find_elements_by_css_selector('._418x')
    if x_elements:
        x = x_elements[0]
        x.click()
        time.sleep(2)
    hash_s = int(hashlib.sha1(link).hexdigest(), 16) % (10 ** 8)
    f_name = '{}-{}.png'.format(post['content'].get('author'), hash_s)
    f_path = os.path.join(SCREENSHOT_DIR, f_name)
    if os.path.exists(f_path):
        print '++ skipping: {} already exists'.format(f_name)
        return
    # elements = fbscraper.driver.find_elements_by_css_selector('.fbUserPost')
    elements = fbscraper.driver.find_elements_by_css_selector('._1w_m')
    if elements:
        element = elements[0]
        location = element.location
        size = element.size
        dpr = 2  # device_pixel_ratio
        # dpr = 1 # device_pixel_ratio
        # location = {'y': element.location['y'], 'x': element.location['x'] + 200}
        location = {'y': element.location['y'] * dpr, 'x': element.location['x'] * dpr}
        # size = {'width': (element.size['width'] * 2.0 + 30), 'height': element.size['height']}
        size = {'width': (element.size['width'] * dpr), 'height': element.size['height'] * dpr}
        print 'location: {}'.format(location)
        print 'size: {}'.format(size)
        temp_path = 'screenshot.png'
        # fbscraper.driver.save_screenshot(temp_path)
        fullpage_screenshot(driver=fbscraper.driver, file=temp_path)
        crop_and_save(input_path=temp_path, location=location, size=size, output_path=f_path)
        time.sleep(2)

def view_posts():
    # parse posts
    files = os.listdir(POSTS_FOLDER)
    all_posts = []
    for f_name in files:
        f_path = os.path.join(POSTS_FOLDER, f_name)
        with open(f_path, 'r') as f:
            data_dict = json.loads(f.read())
            posts_dict = data_dict['posts']
            for user in posts_dict:
                posts = posts_dict[user]
                user_posts = []
                for post in posts:
                    timestamp = post['date']
                    d = datetime.datetime.fromtimestamp(timestamp)
                    if d.day <= 12 and d.day >= 9:
                        user_posts.append(post)
                        all_posts.append(post)
                print('++ {}: {}'.format(user, len(user_posts)))

    # view posts
    print('++ all posts: {}'.format(len(all_posts)))
    chrome_options = Options()
    chrome_options.add_argument("--disable-notifications")
    driver = webdriver.Chrome(chrome_options=chrome_options)
    fbscraper = FbScraper(
        fb_username=ENV_DICT['FB_USERNAME'],
        fb_password=ENV_DICT['FB_PASSWORD'],
        driver=driver
    )
    fbscraper.fb_login()
    random.shuffle(all_posts)
    for post in all_posts:
        save_post(post=post, fbscraper=fbscraper)



if __name__ == '__main__':
    view_posts()


    # chrome_options = Options()
    # chrome_options.add_argument("--disable-notifications")
    # driver = webdriver.Chrome(chrome_options=chrome_options)
    # fbscraper = FbScraper(
    #     fb_username=ENV_DICT['FB_USERNAME'],
    #     fb_password=ENV_DICT['FB_PASSWORD'],
    #     driver=driver
    # )
    # fbscraper.fb_login()
    # post = {
    #     'link': 'https://www.facebook.com/photo.php?fbid=1798124440432611&set=a.1377887902456269.1073741829.100007052163513',
    #     'content': {'author': 'test'}
    # }
    # save_post(post=post, fbscraper=fbscraper)

    # location = {'y': 56.0, 'x': 211.0+200}
    # size = {'width': (500*2.0+30), 'height': 2633}
    # print 'location: {}'.format(location)
    # print 'size: {}'.format(size)
    # temp_path = 'screenshot.png'
    # # fbscraper.driver.save_screenshot(temp_path)
    # f_path = '/Users/maxfowler/computer/projects/opensourcefeeds/whats_on_your_mind/data/screenshots/yoshi141-75650065.png'
    # crop_and_save(input_path=temp_path, location=location, size=size, output_path=f_path)
    # time.sleep(2)
