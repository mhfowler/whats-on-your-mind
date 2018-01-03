import os

try:
    import Image
except ImportError:
    from PIL import Image
import pytesseract

pytesseract.pytesseract.tesseract_cmd = '/usr/local/bin/tesseract'
# Include the above line, if you don't have tesseract executable in your PATH
# Example tesseract_cmd: 'C:\\Program Files (x86)\\Tesseract-OCR\\tesseract'


def get_text_from_images():
    IMG_PATH = '/Users/maxfowler/Desktop/max-selects/approved'
    imgs = os.listdir(IMG_PATH)
    for img in imgs:
        img_path = os.path.join(IMG_PATH, img)
        text = pytesseract.image_to_string(Image.open(img_path), lang='en')
        print text




if __name__ == '__main__':
    get_text_from_images()