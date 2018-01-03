import os
import json
import re


def write_post_text():
    output_file = '/Users/maxfowler/Desktop/rachel-posts.txt'
    POSTS_PATH = '/Users/maxfowler/Desktop/rachel-posts'
    post_files = os.listdir(POSTS_PATH)
    all_posts = []
    for pfile in post_files:
        pfile_path = os.path.join(POSTS_PATH, pfile)
        posts = json.loads(open(pfile_path, 'r').read())
        all_posts += posts
    with open(output_file, 'w') as f:
        for post in all_posts:
            content = post.get('content')
            if content:
                text = content.get('text')
                author = content.get('author')
                if text:
                    text = text.encode('utf8')
                    f.write('{}: {}'.format(author, text))
                    f.write('\n')
                    f.write('\n')


def chronological():
    output_file = '/Users/maxfowler/Desktop/chrono-times.txt'
    text_file = '/Users/maxfowler/Desktop/zine.txt'
    text_of_all_posts = open(text_file, 'r').read()
    text_of_all_posts = text_of_all_posts.replace('\n', '')
    text_of_all_posts = text_of_all_posts.replace(' ', '')
    text_of_all_posts = text_of_all_posts.lower()
    posts_path1 = '/Users/maxfowler/Desktop/rachel-posts'
    posts_path2 = '/Users/maxfowler/Desktop/mf-osf-data/data/posts'
    posts1 = os.listdir(posts_path1)
    posts2 = os.listdir(posts_path2)
    all_posts = []
    for pfile in posts1:
        pfile_path = os.path.join(posts_path1, pfile)
        posts = json.loads(open(pfile_path, 'r').read())
        all_posts += posts
    for pfile in posts2:
        pfile_path = os.path.join(posts_path2, pfile)
        posts = json.loads(open(pfile_path, 'r').read())
        all_posts += posts

    def filter_fun(post):
        content = post.get('content')
        if content:
            text = content.get('text')
            author = content.get('author')
            if text:
                text = text.encode('utf8')
                text = text.replace('\n', '')
                text = text.replace(' ', '')
                text = text.lower()
                snippet = text[:30]
                if snippet in text_of_all_posts:
                    return True
                # if len(text) < 20:
                #     if text in text_of_all_posts:
                #         return True
                # else:
                #     for i in range(0, len(text) - 20):
                #         text_snippet = text[i:i+20]
                #         if text_snippet in text_of_all_posts:
                #             return True

        return False
    final_posts = filter(filter_fun, all_posts)
    print '++ filtered down to {} posts'.format(len(final_posts))
    final_posts.sort(key=lambda post: int(post['date']))
    # final_posts.sort(key=lambda post: post['content']['author'])

    with open(output_file, 'w') as f:
        for post in final_posts:
            content = post.get('content')
            if content:
                text = content.get('text')
                author = content.get('author')
                if text:
                    text = text.encode('utf8')
                    # f.write('{}: {}'.format(author, text))
                    f.write('{}: {}'.format(author, post['date']))
                    f.write('\n')
                    f.write('\n')


if __name__ == '__main__':
    # write_post_text()
    chronological()